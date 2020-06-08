import { Application } from "express";

import expressLoader from './express';
import routesLoader from './routes';

export default async function (app: Application) {
    expressLoader(app);
    routesLoader(app);
}