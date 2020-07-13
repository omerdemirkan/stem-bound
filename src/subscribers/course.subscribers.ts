import { IEventEmitterOnFunction, ECourseEvents, ICourse } from "../types";
import { Subscriber } from "../helpers";
import { logger } from "../config";

function initializeCourseSubscribers(on: IEventEmitterOnFunction) {
    on(ECourseEvents.COURSE_CREATED, function (course: ICourse) {
        logger.info(`New course created by user ${course.meta.instructors[0]}`);
    });
}

export default new Subscriber(initializeCourseSubscribers);
