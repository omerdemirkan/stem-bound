import { Router } from 'express';
import * as studentControllers from './student.controllers';
import { EUserRoles } from '../../../types';
import { AuthMiddlewareService, authMiddlewareService } from '../../../services';

const studentRouter = Router();


studentRouter.get(
    '/',
    studentControllers.getStudents
);

studentRouter.get(
    '/:id',
    studentControllers.getStudentById
);

studentRouter.get(
    '/:id/courses',
    studentControllers.getStudentCoursesById
)

studentRouter.get(
    '/:id/school',
    studentControllers.getStudentSchoolById
)

studentRouter.patch(
    '/:id',
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ EUserRoles.STUDENT, EUserRoles.ADMIN ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    studentControllers.updateStudentById
);

studentRouter.delete(
    '/:id',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ EUserRoles.STUDENT, EUserRoles.ADMIN ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    studentControllers.deleteStudentById
);

export default studentRouter;