import * as services from "../services/index";
import * as dependencies from "../config/dependency.config";
import * as models from "../models";
import { EventEmitter } from "events";

// Dependency Injection Loader

// In order to ensure a single eventEmitter instance globally, please dont tack it onto global.
export const eventEmitter: EventEmitter = new EventEmitter();

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

export const studentService = new services.StudentService(
    models.Students,
    eventEmitter
);

export const schoolOfficialService = new services.SchoolOfficialService(
    models.SchoolOfficials,
    eventEmitter
);

export const instructorService = new services.InstructorService(
    models.Instructors,
    eventEmitter
);

export const authService = new services.AuthService(
    jwtService,
    bcryptService,
    studentService,
    instructorService,
    schoolOfficialService,
    schoolService
);
