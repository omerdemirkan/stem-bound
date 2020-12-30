import { injectable } from "inversify";
import config from "../config";
import { dependency } from "../decorators";
import { IBcrypt, EDependencies, IBcryptService } from "../types";

@injectable()
class BcryptService implements IBcryptService {
    @dependency(EDependencies.BCRYPT)
    private bcrypt: IBcrypt;

    async hash(s: string): Promise<string> {
        return await this.bcrypt.hash(s, config.saltRounds);
    }

    async compare(s: string, hash: string) {
        return await this.bcrypt.compare(s, hash);
    }

    async replaceKeyWithHash(
        obj: any,
        key: string,
        options?: { newKey?: string }
    ) {
        if (!obj[key]) {
            throw new Error(
                "Error in bcrypt service replaceKeyWithHash function, no key found."
            );
        }

        const hash = await this.hash(obj[key]);
        obj[options?.newKey || key] = hash;

        if (options?.newKey) {
            delete obj[key];
        }
        return obj;
    }
}

export default BcryptService;
