import { Document, Types } from "mongoose";

export interface IMessage {
    text: string;
    meta: {
        from: Types.ObjectId;
        readBy: Types.ObjectId[];
    };
    isDeleted: boolean;
    isEdited: boolean;
    _id?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IChat extends Document {
    messages: IMessage[];
    meta: {
        users: Types.ObjectId[];
    };
    isGroupChat: boolean;
    name?: string;
    pictureUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
