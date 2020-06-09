import 'reflect-metadata';
import { Application } from "express";

import diLoader from './di'
import expressLoader from './express';
// import routesLoader from './routes';



export default async function (app: Application) {
    diLoader();
    expressLoader(app);

    // Using require keyword to delay execution
    require('./routes').default(app)
}