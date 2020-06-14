import { Container } from 'typedi';
import { Router } from 'express';

import * as schoolOfficialControllers from './school-official.controllers';
import { UserRolesEnum } from '../../../config/types.config';
import { AuthMiddlewareService } from '../../../services';

const schoolOfficialRouter = Router();
const authMiddlewareService = Container.get(AuthMiddlewareService);


schoolOfficialRouter.get(
    '/',
    schoolOfficialControllers.getSchoolOfficials
);

schoolOfficialRouter.get(
    '/:id',
    schoolOfficialControllers.getSchoolOfficialById
);

schoolOfficialRouter.patch(
    '/:id',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([UserRolesEnum.SCHOOL_OFFICIAL, UserRolesEnum.ADMIN]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    schoolOfficialControllers.updateSchoolOfficialById
);

schoolOfficialRouter.delete(
    '/:id',
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([UserRolesEnum.ADMIN, UserRolesEnum.SCHOOL_OFFICIAL]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    schoolOfficialControllers.deleteSchoolOfficialById
);

export default schoolOfficialRouter;