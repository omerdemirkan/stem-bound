import { Service } from 'typedi';
import { JwtService } from '.';
import { Request, Response, NextFunction } from 'express';
import { UserRolesEnum } from '../config/types.config';

@Service()
export default class AuthMiddlewareService {
    constructor (
        private jwtService: JwtService
    ) { }

    extractPayloadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const authHeader: string | undefined = req.headers.authorization;
        const token: string | null = authHeader ? authHeader.split(' ')[1] : null;
    
        if (!token) return res.status(401).json({ 
            message: 'Valid token not found.' 
        });
    
        try {
            (req as any).payload = await this.jwtService.verify(token);
            next();
        } catch (e) {
            console.log(e);
            res.sendStatus(403);
        }
    }

    allowedRoles(allowedRoles: UserRolesEnum[]) {
        return [
            this.extractPayloadMiddleware,
            async function(req: Request, res: Response, next: NextFunction) {

                const { role } = (req as any).payload

                if (allowedRoles.includes(role)) {
                    next();
                } else {
                    res.sendStatus(403);
                }
            }
        ]
    }

    requireDocumentOwner(options?: {
        paramKey: string,

    }) {

    }
}