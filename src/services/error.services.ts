import { container, logger } from "../config";
import { EErrorTypes, IErrorService } from "../types";
import { errors } from "../constants";
import { injectable } from "inversify";

@injectable()
class ErrorService implements IErrorService {
    status(error: Error) {
        logger.error("%j" + error, error.stack);
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

container.bind<ErrorService>(ErrorService).toSelf();

export default ErrorService;
