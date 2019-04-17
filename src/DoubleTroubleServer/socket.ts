import { setWsHeartbeat } from "ws-heartbeat/server";
import { DoubleTroubleWebsocket, deserializeMessage, PONG, PING, DTWebsocket } from "DTCore/common";
import { IServerConfig } from "DoubleTroubleServer/config";
import { handleEvent } from "./handlers";
import { ActionCreators } from "../DoubleTrouble/actions/index";

// const sendBatches = (ws: PBWebsocket, people: Array<LdapPerson>) => {
//     const batchToSend = people.splice(0, 10);
//     ws.emit({ kind: "person-batch", payload: batchToSend });
//     if(people.length > 0) {
//         setTimeout((() => sendBatches(ws, people)), 50);
//     }
// }

export const initializeWebsocket = (config: IServerConfig, wss: import("ws").Server) => {
    setWsHeartbeat(wss, (wsocket, data, binary) => {
        const dtws: DTWebsocket = DoubleTroubleWebsocket(wsocket, false);

        const deserialized = deserializeMessage(data.toString());
        switch(deserialized.kind) {
            case "ping": return dtws.emit(PONG);
            case "pong": return dtws.emit(PING);

            case "action-request":
                return handleEvent(deserialized)
                    .then(ares => {
                        if(ares.result === "error") {
                            return ActionCreators.errorResponse(deserialized.payload, ares.message);
                        } else {
                            return ares.response;
                        }
                    })
                    .then(r => dtws.emit({ kind: "action-response", payload: r }));

            default:
                return;
            // case "auth":
                // const bindDn =
                    // deserialized.payload.username

                    // .then(() => ws.emit({ kind: "auth-success", payload: undefined }))
                        // 0;

                // break;
        }
    });
};
