import { Container } from 'typedi';
import { Router } from 'express';
import * as instructorControllers from './instructor.controllers';
import RoleService from '../../../services/role.services';
import { UserRolesEnum } from '../../../config/types.config';

const instructorRouter: Router = Router();
const roleService: RoleService = Container.get(RoleService)


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
    roleService.allowedRolesMiddleware([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    instructorControllers.updateInstructorById
);

// Because delete requests often don't use a request body.
// Not a rest-ful approach but the most efficient in practice.

instructorRouter.post(
    '/delete-many',
    roleService.allowedRolesMiddleware([ UserRolesEnum.ADMIN ]),
    instructorControllers.deleteInstructorsByIds
);

instructorRouter.delete(
    '/:id',
    roleService.allowedRolesMiddleware([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    instructorControllers.deleteInstructorById
);

export default instructorRouter;