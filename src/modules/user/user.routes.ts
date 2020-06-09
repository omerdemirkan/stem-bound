import { Router } from 'express';
import instructorRouter from './instructor/instructor.routes'

const userRouter: Router = Router();

userRouter.use('/instructor', instructorRouter);

export default userRouter;