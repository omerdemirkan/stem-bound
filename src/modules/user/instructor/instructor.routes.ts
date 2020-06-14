import { Container } from 'typedi';
import { Router } from 'express';
import * as instructorControllers from './instructor.controllers';
import { UserRolesEnum } from '../../../config/types.config';
import { AuthMiddlewareService } from '../../../services';

const instructorRouter: Router = Router();
const authMiddlewareService: AuthMiddlewareService = Container.get(AuthMiddlewareService)


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
    authMiddlewareService.allowedRoles([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    instructorControllers.updateInstructorById
);

// Because delete requests often don't use a request body.
// Not a rest-ful approach but the most efficient in practice.

instructorRouter.post(
    '/delete-many',
    authMiddlewareService.allowedRoles([ UserRolesEnum.ADMIN ]),
    instructorControllers.deleteInstructorsByIds
);

instructorRouter.delete(
    '/:id',
    authMiddlewareService.allowedRoles([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    instructorControllers.deleteInstructorById
);

export default instructorRouter;