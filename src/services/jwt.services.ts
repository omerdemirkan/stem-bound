import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import { TokenPayload } from '../config/types.config';

@Service()
export default class JwtService {
    constructor() { }

    sign (payload: TokenPayload | object | Buffer, options?: jwt.SignOptions | undefined): string {
        return jwt.sign(payload, (config.accessTokenSecret as string), options)
    }

    verify (token: string, options?: jwt.VerifyOptions | undefined): string | object {
        return jwt.verify(token, (config.accessTokenSecret as string), options)
    }
}