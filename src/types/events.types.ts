export enum EUserEvents {
    USER_SIGNUP = "USER_SIGNUP",
}

export enum ECourseEvents {
    COURSE_CREATED = "COURSE_CREATED",
}

export type IEventEmitterOnFunction = (
    event: string | symbol,
    listener: (...args: any[]) => void
) => any;
