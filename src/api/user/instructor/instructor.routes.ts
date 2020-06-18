import { Router } from 'express';
import * as instructorControllers from './instructor.controllers';
import { EUserRoles } from '../../../types';
import { 
    authMiddlewareService 
} from '../../../services';

const instructorRouter: Router = Router();


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
    authMiddlewareService.allowedRoles([ EUserRoles.INSTRUCTOR, EUserRoles.ADMIN ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    instructorControllers.updateInstructorById
);

instructorRouter.delete(
    '/:id',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([ EUserRoles.INSTRUCTOR, EUserRoles.ADMIN ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    instructorControllers.deleteInstructorById
);

export default instructorRouter;