import { courseVerificationUpdatesByUserRole } from "../constants";
import { authMiddlewareService } from "../services";

export const validateVerificationStatusUpdateMiddleware = authMiddlewareService.validateRequest(
    ({ body, payload }) =>
        courseVerificationUpdatesByUserRole[payload.user._id].includes(
            body.status
        )
);
