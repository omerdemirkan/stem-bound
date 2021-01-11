import { Container } from "inversify";
import "reflect-metadata";

import { SERVICE } from "../constants/service.constants";
import {
    IAuthMiddlewareService,
    IAuthService,
    IBcryptService,
    IChatService,
    ICourseService,
    IErrorService,
    IJwtService,
    ILocationService,
    IMailingListService,
    IMetadataService,
    ISchoolService,
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
import { jwt } from "../config";

const container = new Container();

container
    .bind<IAuthMiddlewareService>(SERVICE.AUTH_MIDDLEWARE_SERVICE)
    .to(AuthMiddlewareService);

container.bind<IAuthService>(SERVICE.AUTH_SERVICE).to(AuthService);

container.bind<IBcryptService>(SERVICE.BCRYPT_SERVICE).to(BcryptService);

container.bind<IChatService>(SERVICE.CHAT_SERVICE).to(ChatService);

container.bind<ICourseService>(SERVICE.COURSE_SERVICE).to(CourseService);

container.bind<IErrorService>(SERVICE.ERROR_SERVICE).to(ErrorService);

container.bind<IJwtService>(SERVICE.JWT_SERVICE).to(JwtService);

container.bind<ILocationService>(SERVICE.LOCATION_SERVICE).to(LocationService);

container
    .bind<IMailingListService>(SERVICE.MAILING_LIST_SERVICE)
    .to(MailingListService);

container.bind<IMetadataService>(SERVICE.METADATA_SERVICE).to(MetadataService);

container.bind<ISchoolService>(SERVICE.SCHOOL_SERVICE).to(SchoolService);

container.bind<IUserService>(SERVICE.USER_SERVICE).to(UserService);

export const authMiddlewareService = container.get<IAuthMiddlewareService>(
    SERVICE.AUTH_MIDDLEWARE_SERVICE
);
export const authService = container.get<IAuthService>(SERVICE.AUTH_SERVICE);
export const bcryptService = container.get<IBcryptService>(
    SERVICE.BCRYPT_SERVICE
);
export const chatService = container.get<IChatService>(SERVICE.CHAT_SERVICE);
export const courseService = container.get<ICourseService>(
    SERVICE.COURSE_SERVICE
);
export const errorService = container.get<IErrorService>(SERVICE.ERROR_SERVICE);
export const jwtService = container.get<IJwtService>(SERVICE.JWT_SERVICE);
export const locationService = container.get<ILocationService>(
    SERVICE.LOCATION_SERVICE
);
export const mailingListService = container.get<IMailingListService>(
    SERVICE.MAILING_LIST_SERVICE
);
export const metadataService = container.get<IMetadataService>(
    SERVICE.METADATA_SERVICE
);
export const schoolService = container.get<ISchoolService>(
    SERVICE.SCHOOL_SERVICE
);
export const userService = container.get<IUserService>(SERVICE.USER_SERVICE);
