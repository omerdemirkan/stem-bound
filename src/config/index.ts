import dotenv from "dotenv";
import { logger } from "./global.config";

const envFound = dotenv.config();

if (envFound.error) {
    logger.error("!!! env file not found !!!");
}

const config = Object.freeze({
    port: process.env.PORT,
    dbUrl:
        process.env.NODE_ENV === "production"
            ? process.env.CLOUD_DB_URL
            : process.env.LOCAL_DB_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    saltRounds: Number(process.env.SALT_ROUNDS),
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    clientDomain: "stembound.education",
});

if (Object.values(config).includes(undefined)) {
    logger.error(`Some .env variables are missing. config: ${config}`);
}

export default config;

export * from "./constants.config";
export * from "./dependency.config";
export * from "./global.config";
