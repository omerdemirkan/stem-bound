import { Router } from 'express';
import modulesMiddlewares from './modules.middlewares';

import userRouter from './user/user.routes';
import schoolRouter from './school/school.routes';

const router: Router = Router();

router.use(modulesMiddlewares.requestLogger);

router.use('/user', userRouter);
router.use('/school', schoolRouter);

export default router;