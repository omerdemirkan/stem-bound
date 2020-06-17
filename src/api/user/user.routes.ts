import { Router } from 'express';
import instructorRouter from './instructor/instructor.routes';
import studentRouter from './student/student.routes';
import schoolOfficialRouter from './school-official/school-official.routes';

const userRouter: Router = Router();

userRouter.use('/instructor', instructorRouter);
userRouter.use('/student', studentRouter);
userRouter.use('/school-official', schoolOfficialRouter);

export default userRouter;