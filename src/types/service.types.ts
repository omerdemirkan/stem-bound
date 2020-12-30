import { EventEmitter } from "events";
import { SignOptions, VerifyOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import { IRequestValidationFunction, ITokenPayload } from "./auth.types";
import { IChat, IMessage } from "./chat.types";
import { IAnnouncement, ICourse, IMeeting } from "./course.types";
import {
    IFilterQuery,
    IQuery,
    ISubDocumentQuery,
    IUpdateQuery,
} from "./db.types";
import { EErrorTypes } from "./error.types";
import { ILocationData } from "./location.types";
import { IMiddleware } from "./middleware.types";
import { ISchool } from "./school.types";
import { EUserRoles, IUser } from "./user.types";

export interface IAuthMiddlewareService {
    extractTokenPayload: IMiddleware;
    allowedRoles(allowedRoles: (EUserRoles | "ADMIN")[]): IMiddleware;
    matchParamIdToPayloadUserId: IMiddleware;
    blockRequestBodyMetadata: IMiddleware;
    validateRequest(
        comparisonFunction: IRequestValidationFunction
    ): IMiddleware;
}

export interface IAuthService {
    userSignUp(
        userData: Partial<IUser>,
        role: EUserRoles
    ): Promise<{ user: any; accessToken: string }>;

    userLogin(
        email: string,
        password: string
    ): Promise<{ user: any; accessToken: string } | null>;
}

export interface IBcryptService {
    hash(s: string): Promise<string>;
    compare(s: string, hash: string): Promise<boolean>;
    replaceKeyWithHash(
        obj: any,
        key: string,
        options?: { newKey?: string }
    ): object;
}

export interface IChatService {
    createChat(chatData: Partial<IChat>): Promise<IChat>;

    findPrivateChatByUserIds(userIds: Types.ObjectId[]): Promise<IChat>;

    findChatsByUserIds(
        userIds: Types.ObjectId[],
        options?: { exact?: boolean }
    ): Promise<IChat[]>;

    findChatsByUserId(
        userId: Types.ObjectId,
        query?: IQuery<IChat>
    ): Promise<IChat[]>;

    findChats(query: IQuery<IChat>): Promise<IChat[]>;

    findChatsByIds(
        ids: Types.ObjectId[],
        query?: IQuery<IChat>
    ): Promise<IChat[]>;

    findChat(filter: IFilterQuery<IChat>): Promise<IChat>;

    findChatById(chatId: Types.ObjectId): Promise<IChat>;

    updateChat(
        filter: IFilterQuery<IChat>,
        chatData: IUpdateQuery<IChat>
    ): Promise<IChat>;

    updateChatById(
        id: Types.ObjectId,
        chatData: IUpdateQuery<IChat>
    ): Promise<IChat>;

    deleteChat(filter: IFilterQuery<IChat>): Promise<IChat>;

    deleteChatById(id: Types.ObjectId): Promise<IChat>;

    findMessages(query: IQuery<IMessage>): Promise<IMessage[]>;

    findMessage(filter: IFilterQuery<IMessage>): Promise<IMessage>;

    findMessageById(messageId: Types.ObjectId): Promise<IMessage>;

    findMessagesByChatId(
        chatId: Types.ObjectId,
        query?: IQuery<IMessage>
    ): Promise<IMessage[]>;

    createMessage(
        chatId: Types.ObjectId,
        messageData: Partial<IMessage>
    ): Promise<{ message: IMessage; chat: IChat }>;

    updateMessage(
        filter: IFilterQuery<IMessage>,
        messageData: IUpdateQuery<IMessage>
    ): Promise<IMessage>;

    updateMessageById(
        messageId: Types.ObjectId,
        messageData: IUpdateQuery<IMessage>
    ): Promise<IMessage>;

    setMessageDeletion(
        filter: IFilterQuery<IMessage>,
        isDeleted: boolean
    ): Promise<IMessage>;

    setMessageDeletionById(
        messageId: Types.ObjectId,
        isDeleted: boolean
    ): Promise<IMessage>;

    removeUserMetadata(data: {
        userIds: Types.ObjectId[];
        chatIds: Types.ObjectId[];
    }): Promise<void>;

    addUserMetadata(data: {
        userIds: Types.ObjectId[];
        chatIds: Types.ObjectId[];
    }): Promise<void>;
}

export interface ICourseService {
    createCourse(courseData: ICourse): Promise<ICourse>;

    verifyCourse(filter: IFilterQuery<ICourse>): Promise<ICourse>;

    verifyCourseById(courseId: Types.ObjectId): Promise<ICourse>;

    findCourses(query?: IQuery<ICourse>): Promise<ICourse[]>;

    findCoursesByIds(
        ids: Types.ObjectId[],
        options?: { unverified: boolean }
    ): Promise<ICourse[]>;

    findCoursesByInstructorId(
        instructorId: Types.ObjectId,
        query?: IQuery<ICourse>
    ): Promise<ICourse[]>;

    findCoursesByStudentId(
        studentId: Types.ObjectId,
        query?: IQuery<ICourse>
    ): Promise<ICourse[]>;

    findCoursesBySchoolId(
        schoolId: Types.ObjectId,
        query?: IQuery<ICourse>
    ): Promise<ICourse[]>;

    findCourse(filter: IFilterQuery<ICourse>): Promise<ICourse>;

    findCourseById(id: Types.ObjectId): Promise<ICourse>;

    updateCourse(
        filter: IFilterQuery<ICourse>,
        udpateQuery: IUpdateQuery<ICourse>
    ): Promise<ICourse>;

    updateCourseById(
        id: Types.ObjectId,
        newCourse: IUpdateQuery<ICourse>
    ): Promise<ICourse>;

    deleteCourse(filter: IFilterQuery<ICourse>): Promise<ICourse>;
    deleteCourseById(id: Types.ObjectId): Promise<ICourse>;

    findMeetings(
        courseFilter: IFilterQuery<ICourse>,
        query?: ISubDocumentQuery<IMeeting>
    ): Promise<IMeeting[]>;

    findMeetingByCourseId(data: {
        courseId: Types.ObjectId;
        meetingId: Types.ObjectId;
    }): Promise<IMeeting>;

    createMeetings(
        filter: IFilterQuery<ICourse>,
        meetings: IMeeting[]
    ): Promise<IMeeting[]>;

    createMeetingsByCourseId(
        courseId: Types.ObjectId,
        meetings: IMeeting[]
    ): Promise<IMeeting[]>;

    updateMeeting(
        filter: IFilterQuery<ICourse>,
        meetingId: Types.ObjectId,
        meetingData: Partial<IMeeting>
    ): Promise<IMeeting>;

    updateMeetingByCourseId(
        data: { courseId: Types.ObjectId; meetingId: Types.ObjectId },
        meetingData: Partial<IMeeting>
    ): Promise<IMeeting>;

    deleteMeeting(
        filter: IFilterQuery<ICourse>,
        meetingId: Types.ObjectId
    ): Promise<IMeeting>;

    deleteMeetingByCourseId(data: {
        meetingId: Types.ObjectId;
        courseId: Types.ObjectId;
    }): Promise<IMeeting>;

    findAnnouncements(
        courseFilter: IFilterQuery<ICourse>,
        query?: ISubDocumentQuery<IAnnouncement>
    ): Promise<IAnnouncement[]>;

    findAnnouncementsByCourseId(
        courseId: Types.ObjectId,
        query?: ISubDocumentQuery<IAnnouncement>
    ): Promise<IAnnouncement[]>;

    findAnnouncementById(data: {
        courseId: Types.ObjectId;
        announcementId: Types.ObjectId;
    }): Promise<IAnnouncement>;

    createAnnouncement(
        announcementData: Partial<IAnnouncement>,
        courseId: Types.ObjectId
    ): Promise<IAnnouncement>;

    updateAnnouncement(
        filter: IFilterQuery<ICourse>,
        announcementId: Types.ObjectId,
        announcementData: Partial<IAnnouncement>
    ): Promise<IAnnouncement>;

    updateAnnouncementByCourseId(
        data: {
            courseId: Types.ObjectId;
            announcementId: Types.ObjectId;
        },
        announcementData: Partial<IAnnouncement>
    ): Promise<IAnnouncement>;

    deleteAnnouncementById(data: {
        courseId: Types.ObjectId;
        announcementId: Types.ObjectId;
    }): Promise<IAnnouncement>;

    addInstructorMetadata(data: {
        instructorIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }): Promise<void>;

    removeInstructorMetadata(data: {
        instructorIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }): Promise<void>;

    addStudentMetadata(data: {
        studentIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }): Promise<void>;

    removeStudentMetadata(data: {
        studentIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }): Promise<void>;
}

export interface IErrorService {
    status(error: Error): number;

    json(error: Error): object;

    throwError(errorType: EErrorTypes, message: string): void;
}

export interface IJwtService {
    sign(
        payload: ITokenPayload | object | Buffer,
        options?: SignOptions | undefined
    ): string;

    verify(token: string, options?: VerifyOptions | undefined): string | object;
}

export interface ILocationService {
    findLocations(query: IQuery<ILocationData>): Promise<ILocationData[]>;

    findLocationsByText(
        text: string,
        query?: IQuery<ILocationData>
    ): Promise<ILocationData[]>;

    findLocationByZip(zip: string): Promise<ILocationData>;
}

export interface IMailingListService {
    findSubscribers(query?: IQuery<any>): Promise<any[]>;

    findSubscriberByEmail(email: string): Promise<any>;

    findSubscriberById(id: Types.ObjectId): Promise<any>;

    createSubscriber(subscriberData: any): Promise<any>;

    deleteSubscriberById(id: Types.ObjectId): Promise<any>;

    deleteSubscriberByEmail(email: string): Promise<any>;

    sendEmail(emailData: any): Promise<any>;
}

export interface IMetadataService {
    handleDeletedUserMetadataUpdate(deletedUser: IUser): Promise<void>;

    handleNewCourseMetadataUpdate(newCourse: ICourse): Promise<void>;

    handleDeletedCourseMetadataUpdate(deletedCourse: ICourse): Promise<void>;

    handleCourseEnrollmentMetadataUpdate(data: {
        courseId: Types.ObjectId;
        studentId: Types.ObjectId;
    }): Promise<void>;

    handleCourseDropMetadataUpdate(data: {
        courseId: Types.ObjectId;
        studentId: Types.ObjectId;
    }): Promise<void>;

    handleNewChatMetadataUpdate(newChat: IChat): Promise<void>;

    handleDeletedChatMetadataUpdate(deletedChat: IChat): Promise<void>;
}

export interface ISchoolService {
    findSchools(query?: IQuery<ISchool>): Promise<ISchool[]>;

    findSchoolsByCoordinates(
        coordinates: number[],
        query?: IQuery<ISchool>
    ): Promise<ISchool[]>;

    findSchoolsByText(
        text: string,
        query?: IQuery<ISchool>
    ): Promise<ISchool[]>;

    findSchool(filter: IFilterQuery<ISchool>): Promise<ISchool>;

    findSchoolById(id: Types.ObjectId): Promise<ISchool>;

    refreshDatabase(options: {
        url?: string;
    }): Promise<
        | { results: { deletionData: any; insertionData: any } }
        | { error: { message: string } }
    >;
}

export interface IUserService {
    createUser(userData, role: EUserRoles): Promise<IUser>;

    findUsers(query: IQuery<IUser>): Promise<IUser[]>;

    findUsersByCoordinates(
        coordinates: number[],
        query?: IQuery<IUser>
    ): Promise<IUser[]>;

    findUsersByIds(
        ids: Types.ObjectId[],
        query?: IQuery<IUser>
    ): Promise<IUser[]>;

    findUser(filter: IFilterQuery<IUser>): Promise<IUser>;

    findUserById(id: Types.ObjectId): Promise<IUser>;

    findUserByEmail(email: string): Promise<IUser>;

    updateUser(
        filter: IFilterQuery<IUser>,
        userData: IUpdateQuery<IUser>
    ): Promise<IUser>;

    updateUserById(
        userId: Types.ObjectId,
        userData: IUpdateQuery<IUser>
    ): Promise<IUser>;

    deleteUser(where: IQuery<IUser>): Promise<IUser>;

    deleteUserById(id: Types.ObjectId): Promise<IUser>;

    updateUserLocationByZip(
        userId: Types.ObjectId,
        zip: string
    ): Promise<IUser>;

    addCourseMetadata(data: {
        userIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
        roles: EUserRoles[];
    }): Promise<void>;

    removeCourseMetadata(data: {
        userIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
        roles: EUserRoles[];
    }): Promise<void>;

    addChatMetadata(
        data: {
            userIds: Types.ObjectId[];
            chatIds: Types.ObjectId[];
        },
        options?: {
            roles?: EUserRoles[];
        }
    ): Promise<void>;

    removeChatMetadata(
        data: {
            userIds: Types.ObjectId[];
            chatIds: Types.ObjectId[];
        },
        options?: {
            roles?: EUserRoles[];
        }
    ): Promise<void>;
}
