import { Container } from 'typedi';
import { Router } from 'express';

import * as schoolOfficialControllers from './school-official.controllers';
import RoleService from '../../../services/role.services';
import { UserRolesEnum } from '../../../config/types.config';

const schoolOfficialRouter = Router();
const roleService: RoleService = Container.get(RoleService);


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
    roleService.allowedRolesMiddleware([UserRolesEnum.SCHOOL_OFFICIAL, UserRolesEnum.ADMIN]),
    schoolOfficialControllers.updateSchoolOfficialById
);

// Because delete requests often don't use a request body.
// Not a rest-ful approach but the most efficient in practice.

schoolOfficialRouter.post(
    '/delete-many',
    roleService.allowedRolesMiddleware([UserRolesEnum.ADMIN]),
    schoolOfficialControllers.deleteSchoolOfficialsByIds
);

schoolOfficialRouter.delete(
    '/:id',
    roleService.allowedRolesMiddleware([UserRolesEnum.ADMIN]),
    schoolOfficialControllers.deleteSchoolOfficialById
);

export default schoolOfficialRouter;