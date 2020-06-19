import { logger } from "../config";

export default class ErrorParserService {
    status(error: Error) {
        logger.error(error);
        return 400;
    }

    json(error: Error) {
        return {
            error: {
                message: error.message,
            },
        };
    }
}
