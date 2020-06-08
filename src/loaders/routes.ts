import routes from '../modules';
import { Application } from 'express';

export default function(app: Application) {
    app.use('/api', routes);
}