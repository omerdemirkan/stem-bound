import { Router } from 'express';
import * as courseControllers from './course.controllers';
import { EUserRoles } from '../../types';
import { AuthMiddlewareService, authMiddlewareService } from '../../services';

const courseRouter = Router();

courseRouter.get(
    '/',
    courseControllers.getCourses
)

courseRouter.get(
    '/:id',
    courseControllers.getCourseById
)

courseRouter.post(
    '/:id/enroll',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ EUserRoles.STUDENT ]),
    courseControllers.enrollInCourseById
)

courseRouter.post(
    '/:id/drop',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ EUserRoles.STUDENT ]),
    courseControllers.dropCourseById
)

courseRouter.post(
    '/',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ EUserRoles.INSTRUCTOR, EUserRoles.ADMIN ]),
    courseControllers.createCourse
)

courseRouter.patch(
    '/:id',
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ EUserRoles.INSTRUCTOR, EUserRoles.ADMIN ]),
    courseControllers.updateCourseById
)

courseRouter.delete(
    '/:id',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ EUserRoles.INSTRUCTOR, EUserRoles.ADMIN ]),
    courseControllers.deleteCourseById
)

export default courseRouter;