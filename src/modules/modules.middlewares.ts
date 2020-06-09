import { Container } from 'typedi';
import { Request, Response, NextFunction} from 'express';

const { Instructor } = Container.get('models');

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