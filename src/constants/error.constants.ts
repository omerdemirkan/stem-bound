// SCHOOL

import { EErrorTypes } from "../types/error.types";

export const errors = Object.freeze({
    [EErrorTypes.BAD_REQUEST]: {
        status: 400,
        message: "You should read the documentation",
    },
    [EErrorTypes.UNAUTHORIZED]: {
        status: 401,
        message: "You need to be authenticated",
    },
    [EErrorTypes.FORBIDDEN]: {
        status: 403,
        message: "You aren't allowed access",
    },
    [EErrorTypes.DOCUMENT_NOT_FOUND]: {
        status: 404,
        message: "Can't find what you're looking for",
    },
    [EErrorTypes.CONFLICT]: {
        status: 409,
        message: "Conflict found",
    },
});
