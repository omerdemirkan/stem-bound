import jsonwebtoken, {
    SignOptions,
    JwtHeader,
    DecodeOptions,
    VerifyOptions,
} from "jsonwebtoken";

export enum EDependencies {
    JWT = "JWT",
    BCRYPT = "BCRYPT",
}

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

export interface IBcrypt {
    compare(s: string, hash: string): Promise<boolean>;
    compareSync(s: string, hash: string): boolean;
    hash(s: string, salt: number | string): Promise<string>;
    hashSync(s: string, salt?: number | string): string;
    genSalt(callback: (err: Error, salt: string) => void): void;
}
