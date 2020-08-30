import { Types, Document, MongooseFilterQuery } from "mongoose";
import { ILocationData } from ".";

export enum EUserRoles {
    SCHOOL_OFFICIAL = "SCHOOL_OFFICIAL",
    STUDENT = "STUDENT",
    INSTRUCTOR = "INSTRUCTOR",
}

interface IBaseUser extends Document {
    role?: EUserRoles;
    firstName: string;
    lastName: string;
    email: string;
    hash: string;
    shortDescription: string;
    longDescription?: string;
    profilePictureUrl: string;
    location: {
        zip: string;
        city: string;
        state: string;
        geoJSON: {
            type: "Point";
            coordinates: number[];
        };
    };
}

export interface IInstructor extends IBaseUser, Document {
    specialties: string[];
    meta: {
        courses: Types.ObjectId[];
        chats: Types.ObjectId[];
    };
}

export interface ISchoolOfficial extends IBaseUser, Document {
    position: string;
    meta: {
        school: Types.ObjectId;
        chats: Types.ObjectId[];
    };
}

export interface IStudent extends IBaseUser, Document {
    interests: string[];
    meta: {
        school: Types.ObjectId;
        courses: Types.ObjectId[];
        chats: Types.ObjectId[];
    };
}

export type IUser = IInstructor | ISchoolOfficial | IStudent;

export interface IUserQueryOptions {
    limit?: number;
    skip?: number;
    sort?: object;
    role?: EUserRoles;
    where?: MongooseFilterQuery<IUser>;
    coordinates?: number[];
    text?: string;
    excludedUserIds?: string[];
}
