import { Router } from 'express';
import * as instructorControllers from './instructor.controllers';

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
    instructorControllers.updateInstructorById
);

instructorRouter.delete(
    '/:id',
    instructorControllers.deleteInstructorExpenseById
);

export default instructorRouter;