import { Service } from 'typedi';
import { SignOptions, VerifyOptions } from 'jsonwebtoken';
import config from '../config';
import { ITokenPayload } from '../types';

@Service()
export default class JwtService {
    constructor(
        private jwt: any
    ) { }

    sign (payload: ITokenPayload | object | Buffer, options?: SignOptions | undefined): string {
        return this.jwt.sign(payload, (config.accessTokenSecret as string), options)
    }

    verify (token: string, options?: VerifyOptions | undefined): string | object {
        return this.jwt.verify(token, (config.accessTokenSecret as string), options)
    }
}