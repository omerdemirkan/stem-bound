import * as services from "../services/index";
import * as dependencies from "../config/dependency.config";
import * as models from "../models";
import { eventEmitter } from "../config";
import { EUserRoles } from "../types";
import { Model, Document } from "mongoose";
// import { getUserModel } from "../helpers/model.helpers";

// Dependency Injection Loader

export const errorParser = new services.ErrorParserService();

export const jwtService = new services.JwtService(dependencies.jwt);

export const bcryptService = new services.BcryptService(dependencies.bcrypt);

export const authMiddlewareService = new services.AuthMiddlewareService(
    jwtService
);

export const courseService = new services.CourseService(
    models.Courses,
    eventEmitter
);

export const schoolService = new services.SchoolService(models.Schools);

export const chatService = new services.ChatService(models.Chats);

// Moved out of models.helpers.ts to avoid circular dependency
const userModels = {
    [EUserRoles.STUDENT]: models.Students,
    [EUserRoles.INSTRUCTOR]: models.Instructors,
    [EUserRoles.SCHOOL_OFFICIAL]: models.SchoolOfficials,
};

export function getUserModelByRole(role: EUserRoles): Model<Document> {
    return (userModels as any)[role];
}

export const userService = new services.UserService(
    getUserModelByRole,
    models.Users
);

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
    metadataService,
    eventEmitter
);

export const mailingListService = new services.MailingListService(
    models.MailingListSubscriber
);
