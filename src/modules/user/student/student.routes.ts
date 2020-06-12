import { Router } from 'express';

import * as studentControllers from './student.controllers';

const studentRouter = Router();

studentRouter.get(
    '/',
    studentControllers.getStudents
);

studentRouter.get(
    '/:id',
    studentControllers.getStudentById
);

// Because delete requests often don't use a request body.
// Not a rest-ful approach but the most efficient in practice.

studentRouter.patch(
    '/:id',
    studentControllers.updateStudentById
);

studentRouter.post(
    '/delete-many',
    studentControllers.deleteStudentsByIds
);

studentRouter.delete(
    '/:id',
    studentControllers.deleteStudentById
);

export default studentRouter;