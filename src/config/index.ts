import dotenv from "dotenv";

const envFound = dotenv.config();

if (envFound.error) {
    throw new Error("!!! env file not found !!!");
}

const config = Object.freeze({
    port: process.env.PORT,
    localDbUrl: process.env.LOCAL_DB_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    saltRounds: Number(process.env.SALT_ROUNDS),
    mailgunApiKey: process.env.MAILGUN_API_KEY,
});

if (Object.values(config).includes(undefined)) {
    throw new Error(`Some .env variables are missing. config: ${config}`);
}

export default config;

export * from "./constants.config";
export * from "./dependency.config";
export * from "./global.config";
