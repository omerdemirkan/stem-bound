import { Router } from 'express';
import modulesMiddlewares from './modules.middlewares';

const router: Router = Router();

router.get('/', 
    modulesMiddlewares.requestLogger,
    function(req, res) {
        res.send('Yoo');
    }
);

export default router;