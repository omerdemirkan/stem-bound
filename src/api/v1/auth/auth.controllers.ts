import { Request, Response } from "express";
import {
    jwtService,
    errorService,
    authService,
    userService,
} from "../../../services";
import { Types } from "mongoose";
import { EErrorTypes, IModifiedRequest } from "../../../types";
import { configureTokenPayload } from "../../../helpers";

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
                accessToken: jwtService.sign(configureTokenPayload(userData)),
            },
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function signUp(req: IModifiedRequest, res: Response) {
    try {
        const { user, accessToken } = await authService.userSignUp(
            req.body,
            req.query.role || req.body.role
        );

        res.json({
            message: "User sign up successful",
            data: { user, accessToken },
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function logIn(req: IModifiedRequest, res: Response) {
    try {
        const { email, password } = req.body;
        const loginResult = await authService.userLogin(email, password);

        if (!loginResult) {
            return res
                .status(403)
                .json({ error: { message: "Username or Password Incorrect" } });
        }

        const { user, accessToken } = loginResult;

        res.json({
            message: "User log in successful",
            data: { user, accessToken },
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
