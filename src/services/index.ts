

export {default as ErrorParserService} from './error-parser.services';
export {default as JwtService} from './jwt.services';
export {default as BcryptService} from './bcrypt.services';
export {default as AuthMiddlewareService} from './auth-middleware.services';
export {default as AuthService} from './auth.services';
export {default as CourseService} from './course.services';
export {default as InstructorService} from './instructor.services';
export {default as SchoolService} from './school.services';
export {default as SchoolOfficialService} from './school-official.services';
export {default as StudentService} from './student.services';



import * as dependencies from '../config/dependency.config';
import * as models from '../models';

import ErrorParserService from './error-parser.services';
import JwtService from './jwt.services';
import BcryptService from './bcrypt.services';
import AuthMiddlewareService from './auth-middleware.services';
import AuthService from './auth.services';
import CourseService from './course.services';
import InstructorService from './instructor.services';
import SchoolService from './school.services';
import SchoolOfficialService from './school-official.services';
import StudentService from './student.services';
import { EventEmitter } from 'events';


export const events: EventEmitter = new EventEmitter();

export const errorParser: ErrorParserService = new ErrorParserService();

export const jwtService: JwtService = new JwtService(
    dependencies.jwt
);

export const bcryptService: BcryptService = new BcryptService(
    dependencies.bcrypt
);

export const authMiddlewareService: AuthMiddlewareService = new AuthMiddlewareService(
    jwtService
);

export const courseService: CourseService = new CourseService(
    models.Courses, 
    events
);

export const schoolService: SchoolService = new SchoolService(
    models.Schools
);

export const studentService: StudentService = new StudentService(
    models.Students, 
    events
);

export const schoolOfficialService: SchoolOfficialService = new SchoolOfficialService(
    models.SchoolOfficials, 
    events
);

export const instructorService: InstructorService = new InstructorService(
    models.Instructors, 
    events
);

export const authService: AuthService = new AuthService(
    jwtService,
    bcryptService,
    studentService,
    instructorService,
    schoolOfficialService
)


