import { Types, Document } from "mongoose";

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
    longDescription: string;
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
