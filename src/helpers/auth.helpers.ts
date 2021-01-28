import config from "../config";
import { IUser, ITokenPayload } from "../types";

export function configureTokenPayload(user: IUser): ITokenPayload {
    return {
        user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
    };
}

export function getSignUpUrl(signUpToken: string): string {
    return `https://${config.clientDomain}/sign-up/verify-email?sign_up_token=${signUpToken}`;
}
