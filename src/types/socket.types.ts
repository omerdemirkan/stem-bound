import { EventEmitter } from "events";

export enum ESocketEvents {
    CHAT_USER_IS_TYPING = "CHAT_USER_IS_TYPING",
    CHAT_USER_STOPPED_TYPING = "CHAT_USER_STOPPED_TYPING",
    JOIN_ROOM = "JOIN_ROOM",
    LEAVE_ROOM = "LEAVE_ROOM",
}

export interface ISocketOptions {
    eventEmitter: EventEmitter;
}
