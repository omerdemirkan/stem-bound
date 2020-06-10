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

export default schoolRouter;