import { Request, Response, NextFunction } from "express";
import { logger, rateLimiter } from "../../config";

export function requestLogger(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    logger.info(`
        ################################################
        ${req.method} - ${req.originalUrl}
    `);
    next();
}

// Allowing for 200 requests for any 30 minute window
export const apiRateLimiter = rateLimiter({
    windowMs: 30 * 60 * 1000,
    max: 1000,
});
