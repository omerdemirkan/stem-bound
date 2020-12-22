import { rateLimiter } from "../config";

// Allowing for 200 requests for any 30 minute window
export const rateLimiterMiddleware = rateLimiter({
    windowMs: 30 * 60 * 1000,
    max: 1000,
});
