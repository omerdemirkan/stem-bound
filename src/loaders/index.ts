import "reflect-metadata";
import { Application } from "express";
import http from "http";

import "./di.loader";
import "./subscriber.loader";
import socketLoader from "./socket.loader";
import expressLoader from "./express.loader";
import mongooseLoader from "./mongoose.loader";
import routesLoader from "./routes.loader";
import middlewareLoader from "./middleware.loader";

export default async function loadServer({
    app,
}: {
    app: Application;
}): Promise<http.Server> {
    expressLoader(app);
    middlewareLoader(app);
    await mongooseLoader();
    routesLoader(app);

    const server: http.Server = socketLoader(app);
    return server;
}
