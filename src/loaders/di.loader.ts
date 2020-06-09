import { Container } from 'typedi';
import models from '../models';

import { EventEmitter } from 'events';
import rateLimiter from 'express-rate-limit';
import jwt from 'jsonwebtoken'

// Dependency Injection Loader,
// for dependencies that might be changed, things that need one global instance, and things that will be injected into services.

export default function() {
    Container.set('eventEmitter', new EventEmitter());
    Container.set('models', models);
    Container.set('rateLimiter', rateLimiter);
    Container.set('jwt', jwt);
}