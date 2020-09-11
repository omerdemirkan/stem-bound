import { logger } from "../config";
import { EErrorTypes } from "../types";
import { errors } from "../constants";

export default class ErrorService {
    status(error: Error) {
        logger.error("%j" + error);
        return (error as any).status || 400;
    }

    json(error: Error) {
        return {
            message: (error as any)._message || error.message,
        };
    }

    throwError(errorType: EErrorTypes, message: string) {
        const errorData = errors[errorType];
        const error = new Error(message || errorData.message);
        (error as any).status = errorData.status;
        throw error;
    }
}
