import { EventEmitter } from "events";
import { Server, Socket } from "socket.io";
import { IUser } from "./user.types";

export enum ESocketEvents {
    CHAT_USER_STARTED_TYPING = "CHAT_USER_STARTED_TYPING",
    CHAT_USER_STOPPED_TYPING = "CHAT_USER_STOPPED_TYPING",
    CHAT_MESSAGE_CREATED = "CHAT_MESSAGE_CREATED",
    CHAT_MESSAGE_DELETED = "CHAT_MESSAGE_DELETED",
    CHAT_MESSAGE_RESTORED = "CHAT_MESSAGE_RESTORED",
    CHAT_MESSAGE_UPDATED = "CHAT_MESSAGE_UPDATED",
    JOIN_ROOM = "JOIN_ROOM",
    LEAVE_ROOM = "LEAVE_ROOM",
}

export interface ISocketOptions {
    eventEmitter: EventEmitter;
    io: Server;
    user: IUser;
}

export type ISocketInitializer = (
    socket: Socket,
    options: ISocketOptions
) => any;
