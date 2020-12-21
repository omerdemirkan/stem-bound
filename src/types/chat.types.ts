import { Document, Types } from "mongoose";

export interface IMessage extends Document {
    text: string;
    meta: {
        from: Types.ObjectId;
        readBy: Types.ObjectId[];
        chat: Types.ObjectId;
    };
    isDeleted: boolean;
    isEdited: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IChat extends Document {
    messages?: IMessage[];
    meta: {
        users: Types.ObjectId[];
    };
    type: EChatTypes;
    name?: string;
    pictureUrl?: string;
    createdAt?: Date;
    lastMessageSentAt?: Date;
    privateChatKey?: string;
}

export enum EChatTypes {
    "PRIVATE",
    "GROUP",
}
