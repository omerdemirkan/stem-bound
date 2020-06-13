import { Service } from 'typedi';
import { JwtService } from '.';
import { Request, Response, NextFunction } from 'express';
import { UserRolesEnum } from '../config/types.config';

@Service()
export default class RoleService {
    constructor (
        private jwtService: JwtService
    ) { }

    allowedRolesMiddleware(allowedRoles: UserRolesEnum[]) {
        return [
            this.jwtService.extractPayloadMiddleware,
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
}