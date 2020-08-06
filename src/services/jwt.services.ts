import { SignOptions, VerifyOptions } from "jsonwebtoken";
import config from "../config";
import { ITokenPayload } from "../types";

export default class JwtService {
    constructor(private jwt: any) {}

    sign(
        payload: ITokenPayload | object | Buffer,
        options?: SignOptions | undefined
    ): string {
        return this.jwt.sign(
            payload,
            config.accessTokenSecret as string,
            options
        );
    }

    verify(
        token: string,
        options?: VerifyOptions | undefined
    ): string | object {
        console.log(config.accessTokenSecret);
        return this.jwt.verify(
            token,
            config.accessTokenSecret as string,
            options
        );
    }
}
