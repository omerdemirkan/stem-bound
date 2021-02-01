import { Container } from "inversify";
import "reflect-metadata";

import { SERVICE_SYMBOLS } from "../constants/service.constants";
import {
    IAuthMiddlewareService,
    IAuthService,
    IBcryptService,
    IChatService,
    ICourseService,
    IEmailService,
    IErrorService,
    IJwtService,
    ILocationService,
    IMailingListService,
    IMetadataService,
    ISchoolService,
    IStorageService,
    IUserService,
} from "../types";
import {
    AuthMiddlewareService,
    AuthService,
    BcryptService,
    ChatService,
    CourseService,
    ErrorService,
    JwtService,
    LocationService,
    MailingListService,
    MetadataService,
    SchoolService,
    UserService,
} from "../services";
import EmailService from "../services/email.services";
import StorageService from "../services/storage.services";

const container = new Container();

container
    .bind<IAuthMiddlewareService>(SERVICE_SYMBOLS.AUTH_MIDDLEWARE_SERVICE)
    .to(AuthMiddlewareService);

container.bind<IAuthService>(SERVICE_SYMBOLS.AUTH_SERVICE).to(AuthService);

container
    .bind<IBcryptService>(SERVICE_SYMBOLS.BCRYPT_SERVICE)
    .to(BcryptService);

container.bind<IChatService>(SERVICE_SYMBOLS.CHAT_SERVICE).to(ChatService);

container
    .bind<ICourseService>(SERVICE_SYMBOLS.COURSE_SERVICE)
    .to(CourseService);

container.bind<IErrorService>(SERVICE_SYMBOLS.ERROR_SERVICE).to(ErrorService);

container.bind<IJwtService>(SERVICE_SYMBOLS.JWT_SERVICE).to(JwtService);

container
    .bind<ILocationService>(SERVICE_SYMBOLS.LOCATION_SERVICE)
    .to(LocationService);

container
    .bind<IMailingListService>(SERVICE_SYMBOLS.MAILING_LIST_SERVICE)
    .to(MailingListService);

container
    .bind<IMetadataService>(SERVICE_SYMBOLS.METADATA_SERVICE)
    .to(MetadataService);

container
    .bind<ISchoolService>(SERVICE_SYMBOLS.SCHOOL_SERVICE)
    .to(SchoolService);

container.bind<IUserService>(SERVICE_SYMBOLS.USER_SERVICE).to(UserService);

container.bind<IEmailService>(SERVICE_SYMBOLS.EMAIL_SERVICE).to(EmailService);

container
    .bind<IStorageService>(SERVICE_SYMBOLS.STORAGE_SERVICE)
    .to(StorageService);

export const authMiddlewareService = container.get<IAuthMiddlewareService>(
    SERVICE_SYMBOLS.AUTH_MIDDLEWARE_SERVICE
);
export const authService = container.get<IAuthService>(
    SERVICE_SYMBOLS.AUTH_SERVICE
);
export const bcryptService = container.get<IBcryptService>(
    SERVICE_SYMBOLS.BCRYPT_SERVICE
);
export const chatService = container.get<IChatService>(
    SERVICE_SYMBOLS.CHAT_SERVICE
);
export const courseService = container.get<ICourseService>(
    SERVICE_SYMBOLS.COURSE_SERVICE
);
export const errorService = container.get<IErrorService>(
    SERVICE_SYMBOLS.ERROR_SERVICE
);
export const jwtService = container.get<IJwtService>(
    SERVICE_SYMBOLS.JWT_SERVICE
);
export const locationService = container.get<ILocationService>(
    SERVICE_SYMBOLS.LOCATION_SERVICE
);
export const mailingListService = container.get<IMailingListService>(
    SERVICE_SYMBOLS.MAILING_LIST_SERVICE
);
export const metadataService = container.get<IMetadataService>(
    SERVICE_SYMBOLS.METADATA_SERVICE
);
export const schoolService = container.get<ISchoolService>(
    SERVICE_SYMBOLS.SCHOOL_SERVICE
);
export const userService = container.get<IUserService>(
    SERVICE_SYMBOLS.USER_SERVICE
);
export const emailService = container.get<IEmailService>(
    SERVICE_SYMBOLS.EMAIL_SERVICE
);
export const storageService = container.get<IStorageService>(
    SERVICE_SYMBOLS.STORAGE_SERVICE
);
