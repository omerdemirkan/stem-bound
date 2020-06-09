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

instructorRouter.post(
    '/',
    instructorControllers.createInstructor
);

// Because delete requests often don't use a request body.
// Not a rest-ful approach but the most efficient in practice.

instructorRouter.patch(
    '/:id',
    instructorControllers.updateInstructorById
);

instructorRouter.post(
    '/delete-many',
    instructorControllers.deleteInstructorsByIds
);

instructorRouter.delete(
    '/:id',
    instructorControllers.deleteInstructorById
);

export default instructorRouter;