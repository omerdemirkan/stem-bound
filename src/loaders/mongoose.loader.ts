import mongoose from 'mongoose';
import config, { logger } from '../config'

export default async function() {
    if (!config.localDbUrl) throw new Error('!!! No connection url !!!');
    const data = await mongoose.connect(config.localDbUrl, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: true
    })

    logger.info('MongoDB connected');
}