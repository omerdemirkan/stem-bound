import { Request, Response } from 'express';
import { ErrorParserService, JwtService } from '../../services';
import Container from 'typedi';
import AuthService from './auth.services';
import { UserRolesEnum } from '../../config/types.config';

const errorParser = Container.get(ErrorParserService);
const authService = Container.get(AuthService);
const jwtService = Container.get(JwtService);

export async function me(req: Request, res: Response) {
    try {
        res.json({
            accessToken: jwtService.sign((req as any).payload)
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function signUp(req: Request, res: Response) {
    try {

        const { user, accessToken } = await authService.userSignUp({
            role: (req.query.role as any),
            userData: req.body
        })

        res.json({
            data: { user, accessToken }
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function logIn(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const loginResult = await authService.userLogin({
            role: (req.query.role as any),
            email,
            password
        })

        if (!loginResult) {
            return res
            .status(403)
            .json({ error: { message: 'Username or Password Incorrect' } });
        }

        const { user, accessToken } = loginResult;

        res.json({
            data: { user, accessToken }
        })

    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}