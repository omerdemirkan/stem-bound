import { Application } from "express";
import {
    modifyRequestMiddleware,
    rateLimiterMiddleware,
    loggerMiddleware,
} from "../middlewares";

export default function middlewareLoader(app: Application) {
    app.use(modifyRequestMiddleware);
    app.use(rateLimiterMiddleware);
    app.use(loggerMiddleware);
}
