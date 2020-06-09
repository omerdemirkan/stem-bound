import routes from '../modules/modules.routes';
import { Application } from 'express';

export default function(app: Application) {
    app.use('/api', routes);
}