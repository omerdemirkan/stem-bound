import { Container } from 'typedi';
import { Router } from 'express';
import * as authControllers from './auth.controllers';
import { JwtService } from '../../services';

const jwtService = Container.get(JwtService);

const authRouter = Router();

authRouter.get(
    '/me',
    jwtService.extractPayloadMiddleware,
    authControllers.me
);

authRouter.post(
    '/sign-up',
    authControllers.signUp
)

authRouter.post(
    '/log-in',
    authControllers.logIn
);

export default authRouter;