import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ITokenPayload } from '../types';

@Service()
export default class JwtService {
    constructor() { }

    sign (payload: ITokenPayload | object | Buffer, options?: jwt.SignOptions | undefined): string {
        return jwt.sign(payload, (config.accessTokenSecret as string), options)
    }

    verify (token: string, options?: jwt.VerifyOptions | undefined): string | object {
        return jwt.verify(token, (config.accessTokenSecret as string), options)
    }
}