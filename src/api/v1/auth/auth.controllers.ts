import { Response } from "express";
import {
    jwtService,
    errorService,
    authService,
    userService,
} from "../../../services";
import { Types } from "mongoose";
import { EErrorTypes, IModifiedRequest, IUser } from "../../../types";
import { getTokenPayload, sendSignUpEmail } from "../../../helpers";

const { ObjectId } = Types;

export async function me(req: IModifiedRequest, res: Response) {
    try {
        const userData = await userService.findUserById(
            ObjectId(req.payload.user._id)
        );

        if (!userData) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "User data not found"
            );
        }

        res.json({
            message: "Access token successfully refreshed",
            data: {
                user: userData,
                accessToken: jwtService.sign(getTokenPayload(userData)),
            },
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function sendVerificationEmail(
    req: IModifiedRequest,
    res: Response
) {
    // Stage 1: generate sign up token, send verification
    try {
        const userData = await userService.configureUserData(
                req.body as Partial<IUser>,
                req.query.role || req.body.role
            ),
            userValidation = await userService.validate(userData);
        if (!userValidation.isValid)
            errorService.throwError(
                EErrorTypes.BAD_REQUEST,
                userValidation.error
            );

        await sendSignUpEmail(userData);

        res.json({
            message: `Email sent to ${userData.email}`,
        });
    } catch (e) {
        console.log(JSON.stringify(e));
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function signUp(req: IModifiedRequest, res: Response) {
    // Stage 2: validate sign up token and officially create user
    try {
        if (!req.params.sign_up_token)
            errorService.throwError(
                EErrorTypes.BAD_REQUEST,
                "Missing sign up token"
            );

        const userData: Partial<IUser> = jwtService.verify(
            req.params.sign_up_token
        );
        const user = await authService.userSignUp(userData, userData.role);

        res.json({
            message: "User sign up successful",
            data: user,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function logIn(req: IModifiedRequest, res: Response) {
    try {
        const { email, password } = req.body;
        const loginResult = await authService.userLogin(email, password);

        if (!loginResult)
            errorService.throwError(
                EErrorTypes.UNAUTHORIZED,
                "Username or Password Incorrect"
            );

        const { user, accessToken } = loginResult;

        res.json({
            message: "User log in successful",
            data: { user, accessToken },
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
