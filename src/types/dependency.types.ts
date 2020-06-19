import jsonwebtoken, {
    SignOptions,
    JwtHeader,
    DecodeOptions,
    VerifyOptions,
} from "jsonwebtoken";

export interface IJwt {
    sign(
        payload: string | object | Buffer,
        secretOrPrivateKey: jsonwebtoken.Secret,
        options?: jsonwebtoken.SignOptions | undefined
    ): string;
    decode(
        token: string,
        options: jsonwebtoken.DecodeOptions & { json: true }
    ): { [key: string]: any } | null;
    verify(
        token: string,
        secretOrPublicKey: jsonwebtoken.Secret,
        options?: jsonwebtoken.VerifyOptions | undefined
    ): string | object;

    SignOptions: SignOptions;
    JwtHeader: JwtHeader;
    DecodeOptions: DecodeOptions;
    VerifyOptions: VerifyOptions;
}
