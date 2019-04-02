import * as express from "express";
import { ServerConfig } from "DoubleTroubleServer/config";
import { initializeWebsocket } from "./socket";
import { initializeDatabase } from "./data";

export const init = (config: ServerConfig) => {
    import("express-ws").then(expressWebsocketLib => {
        setTimeout(() => initializeDatabase({host: "couch", port: 5984}), 5000);        

        const wsApp = expressWebsocketLib(express());
        const app = wsApp.app;
        
        app.ws('/ws', (ws, req, next) => {
            console.log("Incoming websocket connection");
        });
        initializeWebsocket(config, wsApp.getWss());
        
        const staticPath = `${__dirname}/${config.clientRelativePath}`;
        console.log(`Using static files at '${staticPath}'`);

        app.use(express.static(staticPath));
        
        app.listen(config.port);
        console.log(`Listening at http://0.0.0.0:${config.port}`);
    })
};