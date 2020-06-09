import 'reflect-metadata';
import { Application } from "express";

import diLoader from './di.loader'
import expressLoader from './express.loader';
import mongooseLoader from './mongoose.loader';
import eventsLoader from './events.loader'

export default async function ({ app }: {
    app: Application
}) {
    diLoader();
    expressLoader(app);
    eventsLoader();

    await mongooseLoader();

    // Using require keyword to delay execution (to execute other loaders before initializing routes)
    require('./routes.loader').default(app)
}