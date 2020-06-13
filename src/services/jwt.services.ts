import { Service } from 'typedi';
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

    extractPayloadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const authHeader: string | undefined = req.headers.authorization;
        const token: string | null = authHeader ? authHeader.split(' ')[1] : null;
    
        if (!token) return res.status(401).json({ 
            message: 'Valid token not found.' 
        });
    
        try {
            (req as any).payload = await this.verify(token);
            next();
        } catch (e) {
            console.log(e);
            res.sendStatus(403);
        }
    }
}