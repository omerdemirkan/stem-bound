import { request } from "express";
import { Types } from "mongoose";
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

const { ObjectId } = Types;

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
    } = requestMetadata.query;

    skip = +skip;
    limit = +limit;
    unverified = !!unverified;
    instructor_id = ObjectId.isValid(instructor_id)
        ? ObjectId(instructor_id)
        : null;
    student_id = ObjectId.isValid(student_id) ? ObjectId(student_id) : null;
    type = isValidCourseType(type) ? type : null;

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

export function configureCourseVerificationStatusUpdate(
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

export function isValidCourseType(courseType: ECourseTypes): boolean {
    return Object.keys(ECourseTypes).includes(courseType);
}

export function isValidMeetingType(meetingType: EMeetingTypes): boolean {
    return Object.keys(EMeetingTypes).includes(meetingType);
}

export function validateMeetingTimes(meetings: IMeeting[]) {
    // -1 means an ending state change, 1 means starting.
    let stateChanges: { step: 1 | -1; time: Date; meetingId: string }[] = [];

    for (let meeting of meetings) {
        stateChanges.push({
            step: 1,
            time: new Date(meeting.start),
            meetingId: meeting._id.toString(),
        });
        stateChanges.push({
            step: -1,
            time: new Date(meeting.end),
            meetingId: meeting._id.toString(),
        });
    }

    stateChanges = stateChanges.sort(function (a, b) {
        if (a.time !== b.time) return a.time.getTime() - b.time.getTime();
        // If a is an ending state change (i.e step is -1)
        // a takes precedence, otherwise b takes precedence.
        // Note that its impossible for a.step === b.step.
        return a.step;
    });

    for (let i = 1; i < stateChanges.length; i += 2) {
        if (
            stateChanges[i - 1].step !== 1 ||
            stateChanges[i].step !== -1 ||
            stateChanges[i].meetingId !== stateChanges[i - 1].meetingId
        )
            return false;
    }

    return true;
}
