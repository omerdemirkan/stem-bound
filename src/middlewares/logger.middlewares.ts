import { Response } from "express";
import { logger } from "../config";
import { IModifiedRequest } from "../types";

export function loggerMiddleware(
    req: IModifiedRequest,
    res: Response,
    next
): void {
    logger.info(`
        ################################################
        ${req.method} - ${req.originalUrl}
    `);
    next();
}
