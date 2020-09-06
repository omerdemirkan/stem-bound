export enum EUserEvents {
    USER_SIGNUP = "USER_SIGNUP",
}

export enum ECourseEvents {
    COURSE_CREATED = "COURSE_CREATED",
    COURSE_ANNOUNCEMENT_CREATED = "COURSE_ANNOUNCEMENT_CREATED",
}

export enum EChatEvents {
    CHAT_MESSAGE_CREATED = "CHAT_MESSAGE_CREATED",
    CHAT_MESSAGE_UPDATED = "CHAT_MESSAGE_UPDATED",
    CHAT_MESSAGE_DELETED = "CHAT_MESSAGE_DELETED",
}

export type IEventEmitterOnFunction = (
    event: string | symbol,
    listener: (...args: any[]) => void
) => any;
