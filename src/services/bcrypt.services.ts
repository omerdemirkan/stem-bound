import { Service } from 'typedi';
import config from '../config';

import bcrypt from 'bcryptjs';

@Service()
export default class BcryptService {
    constructor() { }
    
    async hash(s: string): Promise<string> {
        return await bcrypt.hash(s, config.saltRounds)
    }

    async compare(s: string, hash: string) {
        return await bcrypt.compare(s, hash)
    }

    async removePasswordAndInsertHash(obj: any): Promise<any> {
        if (!obj.password) throw new Error(
            'Password not found in object passed into removePasswordAndInsertHash function in bcrypt service'
        );
        obj.hash = await this.hash(obj.password);
        delete obj.password;
        return obj;
    }
}