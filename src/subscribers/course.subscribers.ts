import { eventEmitter, logger } from "../config";
import {
    sendCourseDismissedEmails,
    sendCoursePublishedEmails,
    sendCourseVerifiedEmails,
} from "../jobs";
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
            switch (courseVerificationStatusUpdate.status) {
                case ECourseVerificationStatus.PENDING_VERIFICATION:
                    await sendCoursePublishedEmails(updatedCourse._id);
                    break;
                case ECourseVerificationStatus.VERIFIED:
                    await sendCourseVerifiedEmails(updatedCourse._id);
                    break;
                case ECourseVerificationStatus.DISMISSED:
                    await sendCourseDismissedEmails(updatedCourse._id);
                    break;
            }
        } catch (error) {
            logger.error(
                "An error occured when sending course verification update emails",
                error
            );
        }
    }
);
