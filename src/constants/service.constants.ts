// InversifyJS, our dependency injection library, asks for symbol identifiers for our services.

export const SERVICE = {
    AUTH_MIDDLEWARE_SERVICE: Symbol.for("AUTH_MIDDLEWARE_SERVICE"),
    AUTH_SERVICE: Symbol.for("AUTH_SERVICE"),
    BCRYPT_SERVICE: Symbol.for("BCRYPT_SERVICE"),
    CHAT_SERVICE: Symbol.for("CHAT_SERVICE"),
    COURSE_SERVICE: Symbol.for("COURSE_SERVICE"),
    ERROR_SERVICE: Symbol.for("ERROR_SERVICE"),
    JWT_SERVICE: Symbol.for("JWT_SERVICE"),
    LOCATION_SERVICE: Symbol.for("LOCATION_SERVICE"),
    MAILING_LIST_SERVICE: Symbol.for("MAILING_LIST_SERVICE"),
    METADATA_SERVICE: Symbol.for("METADATA_SERVICE"),
    SCHOOL_SERVICE: Symbol.for("SCHOOL_SERVICE"),
    USER_SERVICE: Symbol.for("USER_SERVICE"),
};
