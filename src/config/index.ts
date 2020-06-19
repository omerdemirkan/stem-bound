import dotenv from "dotenv";

const envFound = dotenv.config();

if (envFound.error) {
    throw new Error("!!! env file not found !!!");
}

export default Object.freeze({
    port: process.env.PORT,
    localDbUrl: process.env.LOCAL_DB_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    saltRounds: Number(process.env.SALT_ROUNDS),
});
