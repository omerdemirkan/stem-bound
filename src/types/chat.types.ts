import { Document, Types } from "mongoose";

export interface IMessage {
    text: string;
    meta: {
        from: Types.ObjectId;
        readBy: Types.ObjectId[];
    };
    isDeleted: boolean;
    _id?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IChat extends Document {
    messages: IMessage[];
    meta: {
        users: Types.ObjectId[];
    };
    createdAt?: Date;
    updatedAt?: Date;
}
