import "reflect-metadata";
import { Application } from "express";

import "./di.loader";
import socketLoader from "./socket.loader";
import expressLoader from "./express.loader";
import mongooseLoader from "./mongoose.loader";
import eventsLoader from "./events.loader";
import routesLoader from "./routes.loader";

export default async function ({ app }: { app: Application }) {
    expressLoader(app);
    socketLoader(app);
    eventsLoader();
    await mongooseLoader();
    routesLoader(app);
}
