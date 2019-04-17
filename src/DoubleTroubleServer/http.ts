// import expressWs = require("express-ws");
// import { RequestHandler } from "express";
// import { createDatastoreObject } from "./data";
// import { getConfig } from "./config";

// const getAuthedUser: RequestHandler = (req, res, next) => {
//     if(req.session) {
//         if(req.session.user) {
//             let userId: string = req.session.user;
//             createDatastoreObject(getConfig().db)
//                 .then(db => db.users.get(userId))
//                 .then(body => res.status(200).send(body))
//                 .catch(e => res.status(404).send(e));
//                 next();
//         } else {
//             res.status(401);
//             next();
//         }
//     }
// }
