import { request } from "express";
import { Types } from "mongoose";
import { logger } from "../config";
import {
    ICourse,
    IMeeting,
    IQuery,
    ISubDocumentQuery,
    IRequestMetadata,
    IAnnouncement,
    ECourseTypes,
    EMeetingTypes,
    ICourseVerificationStatusUpdate,
    ECourseVerificationStatus,
} from "../types";
import { configureSubdocumentQuery } from "./query.helpers";
import { isValidDateString } from "./validation.helpers";

const { ObjectId } = Types;

// Query configurations

export function configureCourseArrayQuery(
    requestMetadata: IRequestMetadata
): IQuery<ICourse> {
    let {
        skip,
        limit,
        unverified,
        verification_status,
        type,
        school_id,
        instructor_id,
        student_id,
        text,
        before,
        after,
    } = requestMetadata.query;

    skip = +skip;
    limit = +limit;
    unverified = !!unverified;
    instructor_id = ObjectId.isValid(instructor_id)
        ? ObjectId(instructor_id)
        : null;
    student_id = ObjectId.isValid(student_id) ? ObjectId(student_id) : null;
    type = isValidCourseType(type) ? type : null;
    before = isValidDateString(before) ? new Date(before) : null;
    after = isValidDateString(after) ? new Date(after) : null;

    let query: IQuery<ICourse> = { filter: {} };

    if (skip) query.skip = skip;
    if (limit) query.limit = limit;
    if (unverified)
        query.filter.verificationStatus = {
            $ne: ECourseVerificationStatus.VERIFIED,
        };
    if (verification_status)
        query.filter.verificationStatus = verification_status;
    if (type) query.filter.type = type;
    if (text) query.filter.$text = { $search: text };
    if (before) query.filter.start = { $lt: before };
    if (after) query.filter.end = { $gt: after };

    // @ts-ignore
    if (school_id) query.filter["meta.school"] = school_id;
    // @ts-ignore
    if (instructor_id) query.filter["meta.instructors"] = instructor_id;
    // @ts-ignore
    if (student_id) query.filter["meta.students"] = student_id;
    return query;
}

export function configureMeetingArrayQuery(
    requestMetadata: IRequestMetadata
): ISubDocumentQuery<IMeeting> {
    let query = configureSubdocumentQuery<IMeeting>(requestMetadata, {
        timeKey: "start",
    });
    let { type, room_num } = requestMetadata.query;
    type = isValidMeetingType(type) ? type : null;

    if (type)
        query.filter = (meeting) =>
            query.filter(meeting) && meeting.type === type;
    if (room_num)
        query.filter = (meeting) =>
            query.filter(meeting) && meeting.roomNum === room_num;

    if (query.filter) return query;
}

export function configureAnnouncementArrayQuery(
    requestMetadata: IRequestMetadata
): ISubDocumentQuery<IAnnouncement> {
    let query = configureSubdocumentQuery<IAnnouncement>(requestMetadata);
    return query;
}

export function configureCourseVerificationStatusUpdateQuery(
    requestMetadata: IRequestMetadata
): ICourseVerificationStatusUpdate {
    const userId = ObjectId(requestMetadata.payload.user._id);
    const courseVerificationStatusUpdate: ICourseVerificationStatusUpdate =
        requestMetadata.body;
    if (!courseVerificationStatusUpdate.meta)
        courseVerificationStatusUpdate.meta = {
            from: userId,
        };
    else courseVerificationStatusUpdate.meta.from = userId;
    return courseVerificationStatusUpdate;
}

// Response configurations

export function configureCourseArrayResponseData(
    courses: ICourse[],
    requestMetadata: IRequestMetadata
): Partial<ICourse>[] {
    const { payload } = requestMetadata;
    const now = new Date();
    const configuredCourses = courses.map((course) => ({
        ...course.toObject(),
        meetings: course.meetings
            .filter((meeting) => meeting.end > now)
            .slice(0, 11),
        announcements:
            !payload?.user ||
            course.meta.instructors
                .map((id) => id.toString())
                .includes(payload?.user._id)
                ? []
                : course.announcements.filter(
                      (announcement) =>
                          !announcement.meta.readBy
                              .map((id) => id.toString())
                              .includes(payload.user._id)
                  ),
    }));
    return configuredCourses;
}

export function configureCourseResponseData(
    course: ICourse,
    requestMetadata: IRequestMetadata
): ICourse {
    const now = new Date();
    return {
        ...course.toObject(),
        meetings: course.meetings
            .filter((meeting) => meeting.end > now)
            .slice(0, 11),
        announcements: course.announcements.slice(0, 5),
    };
}

export function configureMeetingArrayResponseData(
    meetings: IMeeting[],
    requestMetadata: IRequestMetadata
): IMeeting[] {
    let configuredMeetings = [...meetings];
    configuredMeetings.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    return configuredMeetings;
}

export function configureMeetingResponseData(
    meeting: IMeeting,
    requestMetadata: IRequestMetadata
): IMeeting {
    return meeting;
}

export function configureAnnouncementArrayResponseData(
    announcements: IAnnouncement[],
    requestMetadata: IRequestMetadata
): IAnnouncement[] {
    let configuredAnnouncements = [...announcements];
    configuredAnnouncements.sort(
        (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return configuredAnnouncements;
}

export function configureAnnouncementResponseData(
    announcement: IAnnouncement,
    requestMetadata: IRequestMetadata
): IAnnouncement {
    return announcement;
}
// Model Validators

export function courseMeetingsValidator(meetings: IMeeting[]) {
    // -1 means an ending state change, 1 means starting.
    let stateChanges: {
        step: 1 | -1;
        time: Date;
        meetingId: string;
    }[] = [];
    try {
        for (let i = 0; i < meetings.length; i++) {
            stateChanges.push({
                step: 1,
                time: new Date(meetings[i].start),
                meetingId: meetings[i]._id.toString(),
            });
            stateChanges.push({
                step: -1,
                time: new Date(meetings[i].end),
                meetingId: meetings[i]._id.toString(),
            });
        }

        stateChanges.sort(function (a, b) {
            if (a.time !== b.time) return a.time.getTime() - b.time.getTime();
            // If a is an ending state change (i.e step is -1)
            // a takes precedence, otherwise b takes precedence.
            // Note that its impossible for a.step === b.step.
            return a.step;
        });

        // ensuring no overlapping meeting times
        for (let i = 1; i < stateChanges.length; i += 2) {
            if (
                stateChanges[i - 1].step !== 1 ||
                stateChanges[i].step !== -1 ||
                stateChanges[i].meetingId !== stateChanges[i - 1].meetingId
            )
                return false;
        }

        // ensuring all meetings are within the course start and end dates
        if (!this) return true;

        const courseStart = new Date(this.start),
            courseEnd = new Date(this.end);

        for (let i = 0; i < stateChanges.length; i++)
            if (
                stateChanges[i].time.getTime() < courseStart.getTime() ||
                stateChanges[i].time.getTime() > courseEnd.getTime()
            )
                return false;

        return true;
    } catch (e) {
        logger.error("An error occured in courseMeetingsValidator", e);
        return false;
    }
}

export function courseVerificationHistoryValidator(
    courseVerifications: Partial<ICourseVerificationStatusUpdate>[]
) {
    try {
        for (let i = 1; i < courseVerifications.length; i++)
            if (
                courseVerifications[i].status ===
                courseVerifications[i - 1].status
            )
                return false;
        return true;
    } catch (e) {
        logger.error(
            "An error occured in courseVerificationHistoryValidator",
            e
        );
        return false;
    }
}

export function courseEndValidator(end: Date): boolean {
    try {
        const startDate = new Date(this.start),
            endDate = new Date(end);
        return startDate < endDate;
    } catch (e) {
        logger.error("An error occured in courseEndValidator", e);
        return false;
    }
}

// Miscellaneous

export function isValidCourseType(courseType: ECourseTypes): boolean {
    return Object.keys(ECourseTypes).includes(courseType);
}

export function isValidMeetingType(meetingType: EMeetingTypes): boolean {
    return Object.keys(EMeetingTypes).includes(meetingType);
}
