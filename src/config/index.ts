import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
    throw new Error('!!! env file not found !!!')
}

const config = {
    port: process.env.PORT,
    localDbUrl: process.env.LOCAL_DB_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
}

if (!config.port || !config.accessTokenSecret) {
    throw new Error('!!! config port and accessTokenSecret variables required !!!');
}

export default config