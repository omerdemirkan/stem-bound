import { Container } from 'typedi';
import { Request, Response, NextFunction} from 'express';

function requestLogger(req: Request, res: Response, next: NextFunction): void {
    console.log(`
        ################################################
        ${req.method} - ${req.originalUrl}
    `);
    next();
}

export default {
    requestLogger
}