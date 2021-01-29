import config from "../config";
import { emailService, jwtService } from "../services";
import { IUser, ITokenPayload } from "../types";
import { hydrateSignUpHtmlTemplate } from "./template.helpers";

export function getTokenPayload(user: IUser): ITokenPayload {
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

export async function sendSignUpEmail(userData: Partial<IUser>) {
    const signUpToken = jwtService.sign(userData),
        signUpUrl = getSignUpUrl(signUpToken),
        emailHtml = await hydrateSignUpHtmlTemplate({
            firstName: userData.firstName,
            url: signUpUrl,
        });
    await emailService.send({
        to: userData.email,
        html: emailHtml,
        subject: "Verify your email",
        inline: require.resolve("../../public/assets/stem-bound-logo.png"),
    });
}
