import { Service, Container, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import { NextFunction, Request, Response } from 'express';

@Service()
export default class JwtService {
    constructor() { }

    sign (payload: string | object | Buffer, options?: jwt.SignOptions | undefined): string {
        return jwt.sign(payload, (config.accessTokenSecret as string), options)
    }

    verify (token: string, options?: jwt.VerifyOptions | undefined): string | object {
        return jwt.verify(token, (config.accessTokenSecret as string), options)
    }

    async extractPayloadMiddleware(req: Request, res: Response, next: NextFunction) {
        const authHeader: string | undefined = req.headers.authorization;
        const token: string | null = authHeader ? authHeader.split(' ')[1] : null;
    
        if (!token) return res.sendStatus(401);
    
        try {
            (req as any).payload = this.verify(token);
            next();
        } catch (e) {
            res.sendStatus(403);
        }
    }
}