import { Router } from 'express';
import modulesMiddlewares from './modules.middlewares';

import userRouter from './user/user.routes'

const router: Router = Router();

router.use(modulesMiddlewares.requestLogger);

router.use('/user', userRouter);

export default router;