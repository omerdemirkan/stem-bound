import config from "../config";

export default class BcryptService {
    constructor(private bcrypt: any) {}

    async hash(s: string): Promise<string> {
        return await this.bcrypt.hash(s, config.saltRounds);
    }

    async compare(s: string, hash: string) {
        return await this.bcrypt.compare(s, hash);
    }

    async replaceKeyWithHash(
        obj: any,
        { key, newKey }: { key: string; newKey?: string }
    ) {
        if (!obj[key]) {
            throw new Error(
                "Error in bcrypt service replaceKeyWithHash function, no key found."
            );
        }

        const hash = await this.hash(obj[key]);
        obj[newKey || key] = hash;

        if (newKey) {
            delete obj[key];
        }
        return obj;
    }
}
