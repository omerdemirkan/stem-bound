import dotenv from "dotenv";
import { logger } from "./global.config";

dotenv.config();

const config = Object.freeze({
    port: process.env.PORT,
    dbUrl:
        process.env.NODE_ENV === "production"
            ? process.env.CLOUD_DB_URL
            : process.env.LOCAL_DB_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    saltRounds: Number(process.env.SALT_ROUNDS),
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    mailgunApiBaseUrl: process.env.MAILGUN_API_BASE_URL,
    mailgunDomain: "mail.stembound.education",
    clientDomain:
        process.env.NODE_ENV === "production"
            ? "stembound.education"
            : "localhost:3000",
    clientOrigin:
        process.env.NODE_ENV === "production"
            ? "https://stembound.education"
            : "http://localhost:3000",
    projectId: process.env.PROJECT_ID,
    storageBucketName: process.env.STORAGE_BUCKET_NAME as string,
    storageCredentials: JSON.parse(process.env.STORAGE_CREDENTIALS as string),
});

if (Object.values(config).includes(undefined))
    logger.error(`Some .env variables are missing. config: ${config}`);

export default config;

export * from "./dependency.config";
export * from "./global.config";
