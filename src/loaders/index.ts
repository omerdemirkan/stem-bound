import "reflect-metadata";
import { Application } from "express";

import "./di.loader";
import socketLoader from "./socket.loader";
import expressLoader from "./express.loader";
import mongooseLoader from "./mongoose.loader";
import eventsLoader from "./events.loader";
import routesLoader from "./routes.loader";
import { Server } from "http";
import middlewareLoader from "./middleware.loader";

export default async function loadServer({
    app,
}: {
    app: Application;
}): Promise<Server> {
    expressLoader(app);
    middlewareLoader(app);
    eventsLoader();
    await mongooseLoader();
    routesLoader(app);

    const server: Server = socketLoader(app);
    return server;
}
