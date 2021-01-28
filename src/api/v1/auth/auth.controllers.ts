import { Response } from "express";
import {
    jwtService,
    errorService,
    authService,
    userService,
    emailService,
} from "../../../services";
import { Types } from "mongoose";
import {
    EErrorTypes,
    EUserRoles,
    IModifiedRequest,
    IUser,
} from "../../../types";
import {
    configureTokenPayload,
    hydrateSignUpHtmlTemplate,
} from "../../../helpers";
import config from "../../../config";

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
        if (!req.params.sign_up_token) {
            // Stage 1: generate sign up token, send verification
            const userData: Partial<IUser> = req.body,
                userError = await userService.validate(userData);
            if (!userError.isValid)
                errorService.throwError(
                    EErrorTypes.BAD_REQUEST,
                    userError.error
                );
            const signUpToken = jwtService.sign(userData),
                signUpUrl = `https://${config.clientDomain}/sign-up?sign_up_token=${signUpToken}`;

            await emailService.send({
                to: userData.email,
                html: await hydrateSignUpHtmlTemplate({
                    firstName: userData.firstName,
                    url: signUpUrl,
                }),
                subject: "Verify your email",
            });

            res.json({
                message: `Email sent to ${userData.email}`,
            });
        } else {
            // Stage 2: validate sign up token and officially create user
            const userData: Partial<IUser> = jwtService.verify(
                req.params.sign_up_token
            );
            const user = await authService.userSignUp(userData, userData.role);

            res.json({
                message: "User sign up successful",
                data: user,
            });
        }
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
