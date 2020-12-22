import { Types } from "mongoose";
import {
    ICourse,
    ITokenPayload,
    IMeeting,
    IQuery,
    ISubDocumentQuery,
    IRequestMetadata,
    IAnnouncement,
} from "../types";

export function configureCourseArrayQuery(requestQuery: any): IQuery<ICourse> {
    let { skip, limit, school_id, unverified } = requestQuery;
    skip = +skip;
    limit = +limit;
    unverified = !!unverified;
    school_id = school_id ? Types.ObjectId(school_id) : null;
    let query: IQuery<ICourse> = { filter: {} };

    if (skip) query.skip = skip;
    if (limit) query.limit = limit;
    if (unverified) query.filter.verified = false;
    // @ts-ignore
    if (school_id) query.filter.meta = { school: school_id };
    return query;
}

export function configureMeetingArrayQuery(
    requestMetadata: IRequestMetadata
): ISubDocumentQuery<IMeeting> {
    let {} = requestMetadata.query;
    let query = {};
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
        announcements: course.meta.instructors
            .map((id) => id.toString())
            .includes(payload.user._id)
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
