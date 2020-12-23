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
    type: EChatTypes;
    meta: {
        users: Types.ObjectId[];
    };
    name?: string;
    pictureUrl?: string;
    lastMessageSentAt?: Date;
    privateChatKey?: string;
    createdAt?: Date;
    updatedAt?: Date;
    messages?: IMessage[];
}

export enum EChatTypes {
    PRIVATE = "PRIVATE",
    GROUP = "GROUP",
}
