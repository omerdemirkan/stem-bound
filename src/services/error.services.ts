import { logger, errors } from "../config";
import { EErrorTypes } from "../types/error.types";

export default class ErrorService {
    status(error: Error) {
        logger.error(error);
        return (error as any).status || 400;
    }

    json(error: Error) {
        return {
            error: {
                message: error.message,
            },
        };
    }

    throwError(errorType: EErrorTypes) {
        const errorData = errors[errorType];
        const error = new Error(errorData.message);
        (error as any).status = errorData.status;
    }
}
