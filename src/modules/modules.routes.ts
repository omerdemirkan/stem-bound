import { Router } from 'express';
import * as modulesMiddlewares from './modules.middlewares';

import userRouter from './user/user.routes';
import schoolRouter from './school/school.routes';
import authRouter from './auth/auth.routes'

const router: Router = Router();

router.use(modulesMiddlewares.requestLogger);

router.use('/user', userRouter);
router.use('/school', schoolRouter);
router.use('/auth', authRouter);

export default router;