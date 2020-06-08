import express, { Application } from 'express';
import config from './config';

import loaders from './loaders';

const app: Application = express();

(async function() {
    await loaders(app);
    await app.listen(config.port);
    console.log('Server running on port ' + config.port);
})()