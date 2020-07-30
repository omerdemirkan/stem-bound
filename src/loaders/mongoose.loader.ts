import mongoose from "mongoose";
import config, { logger } from "../config";

export default async function mongooseLoader() {
    if (!config.dbUrl) throw new Error("!!! No connection url !!!");
    const data = await mongoose.connect(config.dbUrl, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        autoIndex: true,
    });

    logger.info("MongoDB connected");
}
