import { Container } from 'typedi';
import { Router } from 'express';

import * as studentControllers from './student.controllers';
import { UserRolesEnum } from '../../../config/types.config';
import { AuthMiddlewareService } from '../../../services';

const studentRouter = Router();
const authMiddlewareService: AuthMiddlewareService = Container.get(AuthMiddlewareService);


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
    authMiddlewareService.allowedRoles([ UserRolesEnum.STUDENT, UserRolesEnum.ADMIN ]),
    studentControllers.updateStudentById
);

// Because delete requests often don't use a request body.
// Not a rest-ful approach but the most efficient in practice.

studentRouter.post(
    '/delete-many',
    authMiddlewareService.allowedRoles([ UserRolesEnum.ADMIN ]),
    studentControllers.deleteStudentsByIds
);

studentRouter.delete(
    '/:id',
    authMiddlewareService.allowedRoles([ UserRolesEnum.STUDENT, UserRolesEnum.ADMIN ]),
    studentControllers.deleteStudentById
);

export default studentRouter;