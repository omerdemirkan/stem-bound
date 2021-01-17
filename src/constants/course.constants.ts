import { ECourseVerificationStatus, EUserRoles } from "../types";

export const courseTypes = ["IN_PERSON", "REMOTE", "HYBRID"];

export const meetingTypes = ["IN_PERSON", "REMOTE"];

export const courseVerificationUpdatesByUserRole: {
    [key: string]: ECourseVerificationStatus[];
} = {
    [EUserRoles.INSTRUCTOR]: [
        ECourseVerificationStatus.PENDING_VERIFICATION,
        ECourseVerificationStatus.UNPUBLISHED,
    ],
    [EUserRoles.SCHOOL_OFFICIAL]: [
        ECourseVerificationStatus.VERIFIED,
        ECourseVerificationStatus.DISMISSED,
    ],
};
