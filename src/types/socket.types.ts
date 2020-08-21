import { EventEmitter } from "events";

export enum ESocketEvents {
    CHAT_USER_IS_TYPING = "CHAT_USER_IS_TYPING",
    CHAT_USER_STOPPED_TYPING = "CHAT_USER_STOPPED_TYPING",
}

export interface ISocketOptions {
    eventEmitter: EventEmitter;
    userId: string;
}
