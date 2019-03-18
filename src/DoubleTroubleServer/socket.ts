import * as ws from 'ws';
import { setWsHeartbeat } from 'ws-heartbeat/server';
import { DoubleTroubleWebsocket, deserializeMessage, PONG, PING, DTWebsocket } from 'DTCore/common';
import { ServerConfig } from 'DoubleTroubleServer/config';

// const sendBatches = (ws: PBWebsocket, people: Array<LdapPerson>) => {
//     const batchToSend = people.splice(0, 10);
//     ws.emit({ kind: "person-batch", payload: batchToSend });
//     if(people.length > 0) {
//         setTimeout((() => sendBatches(ws, people)), 50);
//     }
// }

export const initializeWebsocket = (config: ServerConfig, wss: ws.Server) => {
    setWsHeartbeat(wss, (_ws, data, binary) => {
        const ws: DTWebsocket = DoubleTroubleWebsocket(_ws, false);

        const deserialized = deserializeMessage(data.toString());
        switch(deserialized.kind) {
            case "ping": return ws.emit(PONG);
            case "pong": return ws.emit(PING);

            //case "auth":
                //const bindDn = 
                    //deserialized.payload.username

                    //.then(() => ws.emit({ kind: "auth-success", payload: undefined }))
                        //0;
                
                //break;
        }
    });
}