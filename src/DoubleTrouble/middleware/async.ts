import { Middleware, Dispatch, MiddlewareAPI } from "redux";
import { setWsHeartbeat, WebSocketBase } from "ws-heartbeat/client";
import { DoubleTroubleWebsocket, PING, DTWebsocket, UnauthenticatedReduxActionRequest } from "DTCore/common";
import { AppAction, ActionCreators } from "../actions";
import { IApplicationState } from "../store";
import { ClientAction, ActionType } from '../actions/index';
import { AuthenticatedReduxActionRequest } from '../../DTCore/common';

const getWebsocketUrl = (s: string) => {
    const l = window.location;
    const port = parseInt(l.port);

    return ((l.protocol === "https:") ? "wss://" : "ws://") + l.hostname + (((port !== 80) && (port !== 443)) ? ":" + port : "") + l.pathname + s;
};

export const initializeWebsockets = (): DTWebsocket => {
    const ws = DoubleTroubleWebsocket(getWebsocketUrl("ws"));

    setWsHeartbeat(ws.ws as WebSocketBase, JSON.stringify(PING));
    ws.emit(PING);

    return ws;
};

let token: string;
const Req = (a: ClientAction): UnauthenticatedReduxActionRequest => ({kind: "action-request", payload: a});
const AuthReq = (a: ClientAction): AuthenticatedReduxActionRequest => 
    Object.assign({}, Req(a), { kind: "token-action-request" as "token-action-request", token: token });

const activeRequests: Partial<{[k in ActionType]: any}> = {};

export const WebsocketReduxAdapterMiddleware: Middleware =
    (store: MiddlewareAPI<Dispatch<AppAction>, IApplicationState>) => {
        const dtws = initializeWebsockets();
        const dispatch = (aa: AppAction) => Promise.resolve().then(_ => store.dispatch(aa));

        dispatch(ActionCreators.noop());
        
        return (next: Dispatch<AppAction>) => {

            dtws.on("action-response", (msg) => {
                if(msg.payload.type === "WS/auth/result") {
                    token = msg.payload.payload.token;
                }
                dispatch(msg.payload);
            });

            return (action: AppAction) => {
                next(action);
                switch (action.type) {
                        case "WS/auth":
                        case "WS/register":
                            return dtws.emit(Req(action));

                        case "WS/user/me":
                        case "WS/games":
                            if(!!activeRequests[action.type]) {
                                return;
                            }
                            return dtws.emit(AuthReq(action));

                        default:
                            return action;
                    }
            };
        };
    };
