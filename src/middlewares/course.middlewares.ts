import { courseVerificationUpdatesByUserRole } from "../constants";
import { authMiddlewareService } from "../services";

export const validateVerificationStatusUpdateMiddleware = authMiddlewareService.validateRequest(
    function ({ body, payload }) {
        try {
            return courseVerificationUpdatesByUserRole[
                payload.user.role
            ].includes(body.status);
        } catch (e) {
            return false;
        }
    }
);
