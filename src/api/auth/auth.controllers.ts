import { Request, Response } from 'express';
import { 
    jwtService, 
    errorParser, 
    authService 
} from '../../services';


export async function me(req: Request, res: Response) {
    try {
        const userData = req.query.all ?
            await authService.getUserById({ 
                id: (req as any).payload.user._id, 
                role: (req as any).payload.role
            })
        :   (req as any).payload;

        res.json({
            message: '',
            accessToken: jwtService.sign((req as any).payload),
            data: userData
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
            message: '',
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
            message: '',
            data: { user, accessToken }
        })

    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}