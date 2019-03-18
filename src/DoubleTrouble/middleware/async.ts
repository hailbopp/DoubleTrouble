import { Middleware, Dispatch, MiddlewareAPI } from 'redux';
import { setWsHeartbeat, WebSocketBase } from "ws-heartbeat/client";
import { DoubleTroubleWebsocket, PING, DTWebsocket } from "DTCore/common";
import { AppAction, ActionCreators } from '../actions';
import { ApplicationState } from '../store';

const getWebsocketUrl = (s: string) => {
    const l = window.location;
    const port = parseInt(l.port);

    return ((l.protocol === "https:") ? "wss://" : "ws://") + l.hostname + (((port != 80) && (port != 443)) ? ":" + port : "") + l.pathname + s;
};

export const initializeWebsockets = (): DTWebsocket => {
    const ws = DoubleTroubleWebsocket(getWebsocketUrl("ws"));

    setWsHeartbeat(ws.ws as WebSocketBase, JSON.stringify(PING));
    ws.emit(PING);

    return ws;
};

export const WebsocketReduxAdapterMiddleware: Middleware =
    (store: MiddlewareAPI<Dispatch<AppAction>, ApplicationState>) => {
        //const dtws = initializeWebsockets();
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
    
            return (action: AppAction) => {
                next(action);

                    // switch(action.type) {
                    //     case "WS/REQ-LDAP-CFG":
                    //         return pws.emit({ kind: "cfg-request", payload: undefined })

                    //     case "CONTROL/SUBMIT-AUTH-FORM":
                    //         return pws.emit({ kind: "auth", payload: action.payload })

                    //     default:
                    //         return action;
                    // }
            }
        }
    } 
