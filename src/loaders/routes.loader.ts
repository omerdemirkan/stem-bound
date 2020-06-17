import routes from '../api/api.routes';
import { Application } from 'express';

export default function(app: Application) {
    app.use('/api', routes);
}