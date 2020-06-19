export class Subscriber {
    private initialized = false;
    public initialize: () => void;
    constructor(initialize: () => void) {
        // To ensure one initialization
        this.initialize = function () {
            if (!this.initialized) {
                initialize.call(this);
                this.initialized = true;
            }
        };
    }
}

export enum EUserEvents {
    USER_SIGNUP = "USER_SIGNUP",
}

export enum ECourseEvents {
    COURSE_CREATED = "COURSE_CREATED",
}
