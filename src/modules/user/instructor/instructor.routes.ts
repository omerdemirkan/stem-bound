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
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    instructorControllers.updateInstructorById
);

// Because delete requests often don't use a request body.
// Not a rest-ful approach but the most efficient in practice.

instructorRouter.post(
    '/delete-many',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.ADMIN ]),
    instructorControllers.deleteInstructorsByIds
);

instructorRouter.delete(
    '/:id',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    instructorControllers.deleteInstructorById
);

export default instructorRouter;