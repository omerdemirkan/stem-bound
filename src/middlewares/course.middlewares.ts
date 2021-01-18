import { courseVerificationUpdatesByUserRole } from "../constants";
import { authMiddlewareService } from "../services";

export const validateVerificationStatusUpdateMiddleware = authMiddlewareService.validateRequest(
    ({ body, payload }) =>
        courseVerificationUpdatesByUserRole[payload.user.role].includes(
            body.status
        )
);
