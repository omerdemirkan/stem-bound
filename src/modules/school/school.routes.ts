import { Router } from 'express';
import * as schoolController from './school.controllers'

const schoolRouter = Router();

schoolRouter.get(
    '/',
    schoolController.getSchools
);

schoolRouter.get(
    '/:id',
    schoolController.getSchoolById
);

schoolRouter.post(
    '/refresh-database',
    schoolController.refreshDatabase
);

export default schoolRouter;