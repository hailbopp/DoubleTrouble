import * as express from "express";
import { IServerConfig } from "DoubleTroubleServer/config";
import { initializeWebsocket } from "./socket";
import { initializeDatabase } from "./data";
import * as session from "express-session";
import { v4 as uuid } from "uuid";

export const init = (config: IServerConfig) => {
    import("express-ws").then(expressWebsocketLib => {
        setTimeout(() => initializeDatabase({host: "couch", port: 5984}), 5000);

        const wsApp = expressWebsocketLib(express());
        const app = wsApp.app;

        const staticPath = `${__dirname}/${config.clientRelativePath}`;
        console.log(`Using static files at '${staticPath}'`);

        app.use(express.static(staticPath));

        app.use(session({
            secret: uuid(),
            resave: false,
            saveUninitialized: true,
          }));

        app.use((req, res, next) => {
            console.log("incoming request", req.path);
        });

        // const indexFile = `${__dirname}/${config.clientRelativePath}/index.html`;
        // app.get('/', (req, res, next) => {
        //     res.sendFile(indexFile);
        //     next();
        // })

        app.ws("/ws", (ws, req, next) => {
            console.log("Incoming websocket connection");
        });
        initializeWebsocket(config, wsApp.getWss());

        app.listen(config.port);
        console.log(`Listening at http://0.0.0.0:${config.port}`);
    });
};
