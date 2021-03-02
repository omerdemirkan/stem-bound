import { eventEmitter, logger } from "../config";
import { sendCoursePublishedEmails } from "../jobs/email.jobs";
import {
    ECourseEvents,
    ECourseVerificationStatus,
    ICourse,
    ICourseVerificationStatusUpdate,
} from "../types";

eventEmitter.on(
    ECourseEvents.COURSE_VERIFICATION_UPDATED,
    async function (
        courseVerificationStatusUpdate: ICourseVerificationStatusUpdate,
        updatedCourse: ICourse
    ) {
        try {
            if (
                courseVerificationStatusUpdate.status ===
                ECourseVerificationStatus.PENDING_VERIFICATION
            )
                await sendCoursePublishedEmails(updatedCourse._id);
        } catch (e) {
            logger.error(e);
        }
    }
);
