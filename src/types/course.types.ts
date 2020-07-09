import { Document, Types } from "mongoose";

export enum ECourseTypes {
    IN_PERSON = "IN_PERSON",
    REMOTE = "REMOTE",
    HYBRID = "HYBRID",
}

export enum EMeetingTypes {
    IN_PERSON = "IN_PERSON",
    REMOTE = "REMOTE",
}

export interface IMeeting {
    type: string;
    roomNum: string;
    start: Date;
    end: Date;
    message: string;
    _id?: Types.ObjectId;
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
    longDescription: string;
    type: string;
    meetings: IMeeting[];
    announcements: IAnnouncement[];
    meta: {
        instructors: Types.ObjectId[];
        students: Types.ObjectId[];
        school: Types.ObjectId;
    };
}
