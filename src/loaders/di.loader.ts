import * as services from "../services";

// Dependency Injection Loader

export const errorService = new services.ErrorService();

export const jwtService = new services.JwtService();

export const bcryptService = new services.BcryptService();

export const authMiddlewareService = new services.AuthMiddlewareService(
    jwtService
);

export const locationService = new services.LocationService();

export const schoolService = new services.SchoolService();

export const chatService = new services.ChatService(errorService);

export const userService = new services.UserService(locationService);

export const courseService = new services.CourseService(errorService);

export const metadataService = new services.MetadataService(
    schoolService,
    courseService,
    userService,
    chatService
);

export const authService = new services.AuthService(
    jwtService,
    bcryptService,
    userService,
    metadataService
);

export const mailingListService = new services.MailingListService();
