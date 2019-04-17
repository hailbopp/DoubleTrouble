import { Middleware, Dispatch, MiddlewareAPI } from "redux";
import { setWsHeartbeat, WebSocketBase } from "ws-heartbeat/client";
import { DoubleTroubleWebsocket, PING, DTWebsocket, ReduxActionRequest } from "DTCore/common";
import { AppAction, ActionCreators } from "../actions";
import { ApplicationState } from "../store";
import { ClientAction } from "../actions/index";

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

const Req = (a: ClientAction): ReduxActionRequest => ({kind: "action-request", payload: a});

export const WebsocketReduxAdapterMiddleware: Middleware =
    (store: MiddlewareAPI<Dispatch<AppAction>, ApplicationState>) => {
        const dtws = initializeWebsockets();
        const dispatch = (aa: AppAction) => Promise.resolve().then(_ => store.dispatch(aa));

        dispatch(ActionCreators.noop());

        // setInterval(() => {
        //     const s = store.getState();
        //     if(s.people.rawPeople.isDefined) {
        //         dispatch(ActionCreators.processPersonBatch());
        //     }
        // }, 15);

        return (next: Dispatch<AppAction>) => {
            // pws.on("ldap-cfg", (cfgEvt) => {
            //     dispatch(ActionCreators.receiveLdapConfiguration(cfgEvt.payload));
            //         //.then(_ => dispatch(ActionCreators.submitLoginForm("", "")));
            // })

            // pws.on("person-batch", (msg) => {
            //     dispatch(ActionCreators.receivePersonBatch(msg.payload))
            // });

            // pws.on("auth-success", (msg) => {
            //     dispatch(ActionCreators.setAuthenticated(true));
            // })

            dtws.on("action-response", (msg) => {
                dispatch(msg.payload);
            });

            return (action: AppAction) => {
                next(action);
                switch (action.type) {
                        case "WS/auth":
                        case "WS/register":
                            return dtws.emit(Req(action));

                        default:
                            return action;
                    }
            };
        };
    };
