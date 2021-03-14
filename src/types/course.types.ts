import { Document, Types } from "mongoose";

export enum EMeetingTypes {
    IN_PERSON = "IN_PERSON",
    REMOTE = "REMOTE",
}

export interface IMeeting {
    type: string;
    roomNum?: string;
    url?: string;
    start: Date;
    end: Date;
    message: string;
    _id?: Types.ObjectId;
}

export interface IAnnouncement {
    text: string;
    meta: {
        from: Types.ObjectId;
        readBy: Types.ObjectId[];
    };
    _id?: string;
    createdAt?: Date;
}

export enum ECourseTypes {
    IN_PERSON = "IN_PERSON",
    REMOTE = "REMOTE",
    HYBRID = "HYBRID",
}

export enum ECourseVerificationStatus {
    UNPUBLISHED = "UNPUBLISHED",
    PENDING_VERIFICATION = "PENDING_VERIFICATION",
    DISMISSED = "DISMISSED",
    VERIFIED = "VERIFIED",
}

export interface ICourseVerificationStatusUpdate {
    meta: { from: Types.ObjectId };
    status: ECourseVerificationStatus;
    createdAt?: Date;
}

export interface ICourse extends Document {
    title: string;
    verificationStatus: ECourseVerificationStatus;
    verificationHistory: ICourseVerificationStatusUpdate[];
    shortDescription: string;
    longDescription: string;
    type: string;
    meetings: IMeeting[];
    announcements: IAnnouncement[];
    meta: {
        instructors: Types.ObjectId[];
        students: Types.ObjectId[];
        school: string;
    };
}

export interface IMeetingsQuery {
    after?: Date | string;
    before?: Date | string;
}

export interface IInstructorInvitationTokenPayload {
    from: string;
    to: string;
}
