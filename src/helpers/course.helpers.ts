import { Types } from "mongoose";
import {
    ICourse,
    IMeeting,
    IQuery,
    ISubDocumentQuery,
    IRequestMetadata,
    IAnnouncement,
} from "../types";
const { ObjectId } = Types;

export function configureCourseArrayQuery(
    requestMetadata: IRequestMetadata
): IQuery<ICourse> {
    let {
        skip,
        limit,
        unverified,
        school_id,
        instructor_id,
        student_id,
    } = requestMetadata.query;

    skip = +skip;
    limit = +limit;
    unverified = !!unverified;
    school_id = ObjectId.isValid(school_id) ? ObjectId(school_id) : null;
    instructor_id = ObjectId.isValid(instructor_id)
        ? ObjectId(instructor_id)
        : null;
    student_id = ObjectId.isValid(student_id) ? ObjectId(student_id) : null;

    let query: IQuery<ICourse> = { filter: {} };

    if (skip) query.skip = skip;
    if (limit) query.limit = limit;
    if (unverified) query.filter.verified = false;

    // @ts-ignore
    if (school_id) query.filter["meta.school"] = school_id;
    // @ts-ignore
    if (instructor_id) query.filter["meta.instructors"] = instructor_id;
    // @ts-ignore
    if (student_id) query.filter["meta.students"] = student_id;
    console.log(query);
    return query;
}

export function configureMeetingArrayQuery(
    requestMetadata: IRequestMetadata
): ISubDocumentQuery<IMeeting> {
    let { before, after, limit, skip } = requestMetadata.query;

    before = before ? new Date(before) : null;
    after = after ? new Date(after) : null;
    limit = +limit;
    skip = +skip;

    let query: ISubDocumentQuery<IMeeting> = {};

    if (before) query.before = before;
    if (after) query.after = after;
    if (limit) query.limit = limit;
    if (skip) query.skip = skip;
    return query;
}

export function configureAnnouncementArrayQuery(
    requestMetadata: IRequestMetadata
): ISubDocumentQuery<IAnnouncement> {
    let {} = requestMetadata.query;
    let query = {};
    return query;
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
