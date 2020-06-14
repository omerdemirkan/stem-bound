import { Container } from 'typedi';
import { Router } from 'express';
import * as schoolController from './school.controllers';
import { UserRolesEnum } from '../../config/types.config';
import { AuthMiddlewareService } from '../../services';

const schoolRouter = Router();
const authMiddlewareService: AuthMiddlewareService = Container.get(AuthMiddlewareService)

schoolRouter.get(
    '/',
    schoolController.getSchools
);

schoolRouter.get(
    '/:id',
    schoolController.getSchoolById
);

schoolRouter.post(
    '/refresh-database',
    authMiddlewareService.allowedRoles([ UserRolesEnum.ADMIN ]),
    schoolController.refreshDatabase
);

export default schoolRouter;