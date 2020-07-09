import { Document, Types } from "mongoose";

export enum ECourseTypes {
    IN_PERSON = "IN_PERSON",
    REMOTE = "REMOTE",
    HYBRID = "HYBRID",
}

export enum EClassTypes {
    IN_PERSON = "IN_PERSON",
    REMOTE = "REMOTE",
}

export interface IClass {
    type: string;
    roomNum: string;
    start: Date;
    end: Date;
    message: string;
}

export interface IAnnouncement {
    text: string;
    meta: {
        from: Types.ObjectId;
        readBy: Types.ObjectId;
    };
    _id?: string;
    createdAt?: Date;
}

export interface ICourse extends Document {
    title: string;
    shortDescription: string;
    longDescription: {
        type: String;
        minlength: 4;
        maxlength: 2000;
        trim: true;
    };
    type: string;
    classes: IClass[];
    announcements: IAnnouncement[];
    meta: {
        instructors: Types.ObjectId[];
        students: Types.ObjectId[];
        school: Types.ObjectId;
    };
}
