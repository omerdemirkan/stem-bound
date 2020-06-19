import "reflect-metadata";
import { Application } from "express";

import "./di.loader";
import expressLoader from "./express.loader";
import mongooseLoader from "./mongoose.loader";
import eventsLoader from "./events.loader";
import routesLoader from "./routes.loader";

export default async function ({ app }: { app: Application }) {
    expressLoader(app);
    eventsLoader();

    await mongooseLoader();

    // Using require keyword to delay execution (to execute other loaders before initializing routes)
    routesLoader(app);
}
