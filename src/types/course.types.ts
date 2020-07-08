import { Document } from "mongoose";

export enum ECourseTypes {
    IN_PERSON = "IN_PERSON",
    REMOTE = "REMOTE",
    HYBRID = "HYBRID",
}

export enum EClassTypes {
    IN_PERSON = "IN_PERSON",
    REMOTE = "REMOTE",
}

export interface ICourse extends Document {}
