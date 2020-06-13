import { Container } from 'typedi';
import { Router } from 'express';

import * as studentControllers from './student.controllers';
import RoleService from '../../../services/role.services';
import { UserRolesEnum } from '../../../config/types.config';

const studentRouter = Router();
const roleService: RoleService = Container.get(RoleService);


studentRouter.get(
    '/',
    studentControllers.getStudents
);

studentRouter.get(
    '/:id',
    studentControllers.getStudentById
);

studentRouter.patch(
    '/:id',
    roleService.allowedRolesMiddleware([ UserRolesEnum.STUDENT, UserRolesEnum.ADMIN ]),
    studentControllers.updateStudentById
);

// Because delete requests often don't use a request body.
// Not a rest-ful approach but the most efficient in practice.

studentRouter.post(
    '/delete-many',
    roleService.allowedRolesMiddleware([ UserRolesEnum.ADMIN ]),
    studentControllers.deleteStudentsByIds
);

studentRouter.delete(
    '/:id',
    roleService.allowedRolesMiddleware([ UserRolesEnum.STUDENT, UserRolesEnum.ADMIN ]),
    studentControllers.deleteStudentById
);

export default studentRouter;