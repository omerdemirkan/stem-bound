import winston from 'winston';
import { EventEmitter } from 'events';

// For things global variables that I prefer to have one instance of

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

export const eventEmitter = new EventEmitter();