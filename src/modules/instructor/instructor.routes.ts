import { Router } from 'express';
import * as instructorControllers from './instructor.controllers';

const instructorRouter: Router = Router();

instructorRouter.get(
    '/',
    instructorControllers.getInstructors
);

export default instructorRouter;