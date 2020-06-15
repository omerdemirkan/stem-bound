import { Container } from 'typedi';
import { Router } from 'express';
import { AuthMiddlewareService } from '../../services';
import * as courseControllers from './course.controllers';
import { UserRolesEnum } from '../../config/types.config';

const courseRouter = Router();
const authMiddlewareService = Container.get(AuthMiddlewareService)

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
    authMiddlewareService.allowedRoles([ UserRolesEnum.STUDENT ]),
    courseControllers.enrollInCourseById
)

courseRouter.post(
    '/:id/drop',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.STUDENT ]),
    courseControllers.dropCourseById
)

courseRouter.post(
    '/',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    courseControllers.createCourse
)

courseRouter.patch(
    '/:id',
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    courseControllers.updateCourseById
)

courseRouter.delete(
    '/:id',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ UserRolesEnum.INSTRUCTOR, UserRolesEnum.ADMIN ]),
    courseControllers.deleteCourseById
)

export default courseRouter;