import { Container } from 'typedi';
import config from '../config'

import * as models from '../models';
import rateLimiter from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Dependency Injection Loader,
// for dependencies that might be changed, things that need one global instance, and things that will be injected into services.

export default function() {
    Object.keys(models).forEach(modelName => {
        Container.set(`models.${modelName}`, (models as any)[modelName]);
    });

    Container.set('models', models);
    
    Container.set('rateLimiter', rateLimiter);
    Container.set('jwt', jwt);

    Container.set('fetch', axios);
}