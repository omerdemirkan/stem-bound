import { Router } from 'express';

import * as schoolOfficialControllers from './school-official.controllers';

const schoolOfficialRouter = Router();

schoolOfficialRouter.get(
    '/',
    schoolOfficialControllers.getSchoolOfficials
);

schoolOfficialRouter.get(
    '/:id',
    schoolOfficialControllers.getSchoolOfficialById
);

// Because delete requests often don't use a request body.
// Not a rest-ful approach but the most efficient in practice.

schoolOfficialRouter.patch(
    '/:id',
    schoolOfficialControllers.updateSchoolOfficialById
);

schoolOfficialRouter.post(
    '/delete-many',
    schoolOfficialControllers.deleteSchoolOfficialsByIds
);

schoolOfficialRouter.delete(
    '/:id',
    schoolOfficialControllers.deleteSchoolOfficialById
);

export default schoolOfficialRouter;