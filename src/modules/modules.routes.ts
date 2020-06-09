import { Router } from 'express';
import modulesMiddlewares from './modules.middlewares';

import instructorRouter from './instructor/instructor.routes';

const router: Router = Router();

router.use('/instructor', instructorRouter);

export default router;