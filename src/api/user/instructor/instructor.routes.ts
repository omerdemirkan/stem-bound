import { Container } from 'typedi';
import { Router } from 'express';
import * as instructorControllers from './instructor.controllers';
import { UserRolesEnum } from '../../../config/types.config';
import { AuthMiddlewareService } from '../../../services';

const instructorRouter: Router = Router();
const authMiddlewareService = Container.get(AuthMiddlewareService)


instructorRouter.get(
    '/',
    instructorControllers.getInstructors
);

instructorRouter.get(
    '/:id',
    instructorControllers.getInstructorById
);

instructorRouter.patch(
    '/:id',
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    instructorControllers.updateInstructorById
);

instructorRouter.delete(
    '/:id',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    instructorControllers.deleteInstructorById
);

export default instructorRouter;