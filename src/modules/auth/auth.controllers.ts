import { Request, Response } from 'express';
import { ErrorParserService, JwtService } from '../../services';
import Container from 'typedi';
import AuthService from './auth.services';

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
        const { user, accessToken } = await authService.userSignUp(req.body)

        res.json({
            data: { user, accessToken }
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}