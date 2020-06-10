import { Container } from 'typedi';
import config from '../config'

import * as models from '../models';
import rateLimiter from 'express-rate-limit';
import jwt from 'jsonwebtoken'

// Dependency Injection Loader,
// for dependencies that might be changed, things that need one global instance, and things that will be injected into services.

export default function() {
    Object.keys(models).forEach(modelName => {
        Container.set(`models.${modelName}`, (models as any)[modelName]);
    });

    Container.set('models', models);
    
    Container.set('rateLimiter', rateLimiter);
    Container.set('jwt', {
        sign: function (payload: string | object | Buffer, options?: jwt.SignOptions | undefined) {
            return jwt.sign(payload, (config.accessTokenSecret as string), options)
        },
        verify: function (token: string, options?: jwt.VerifyOptions | undefined) {
            return jwt.verify(token, (config.accessTokenSecret as string), options)
        }
    });
}