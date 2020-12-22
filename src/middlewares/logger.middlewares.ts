import { Request, Response } from "express";
import { logger } from "../config";

export function loggerMiddleware(req: Request, res: Response, next): void {
    logger.info(`
        ################################################
        ${req.method} - ${req.originalUrl}
    `);
    next();
}
