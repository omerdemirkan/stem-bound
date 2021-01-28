import { injectable } from "inversify";
import { SignOptions, VerifyOptions } from "jsonwebtoken";
import config from "../config";
import { ITokenPayload, IJwtService } from "../types";

import jwt from "jsonwebtoken";

@injectable()
class JwtService implements IJwtService {
    sign(
        payload: ITokenPayload | object | Buffer,
        options?: SignOptions | undefined
    ): string {
        return jwt.sign(payload, config.accessTokenSecret, options);
    }

    verify(
        token: string,
        options?: VerifyOptions | undefined
    ): string | object {
        return jwt.verify(token, config.accessTokenSecret as string, options);
    }
}

export default JwtService;
