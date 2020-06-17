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
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.STUDENT, UserRolesEnum.ADMIN ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    studentControllers.updateStudentById
);

studentRouter.delete(
    '/:id',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.STUDENT, UserRolesEnum.ADMIN ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    studentControllers.deleteStudentById
);

export default studentRouter;