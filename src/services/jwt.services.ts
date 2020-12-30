import { SignOptions, VerifyOptions } from "jsonwebtoken";
import config, { container } from "../config";
import { ITokenPayload, IJwt, EDependencies } from "../types";
import { dependency } from "../decorators";
import { injectable } from "inversify";

@injectable()
class JwtService {
    @dependency(EDependencies.JWT)
    private jwt: IJwt;

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
        return this.jwt.verify(
            token,
            config.accessTokenSecret as string,
            options
        );
    }
}

container.bind<JwtService>(JwtService).toSelf();

export default JwtService;
