import {
    ICourse,
    ITokenPayload,
    IMessage,
    IMeeting,
    IMeetingsQuery,
} from "../types";

export function configureCourseArrayResponseData(
    courses: ICourse[],
    {
        query,
        payload,
    }: {
        query: any;
        payload: ITokenPayload;
    }
): Partial<ICourse>[] {
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
    {
        query,
        payload,
    }: {
        query: any;
        payload: ITokenPayload;
    }
): Partial<ICourse> {
    const now = new Date();
    return {
        ...course.toObject(),
        meetings: course.meetings
            .filter((meeting) => meeting.end > now)
            .slice(0, 11),
        announcements: course.announcements.slice(0, 5),
    };
}

export function configureMeetingArrayResponseData(meetings: IMeeting[]) {
    let configuredMeetings = [...meetings];
    configuredMeetings.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    return configuredMeetings;
}

export function configureMeetingArrayQuery(
    requestQuery: any
): Partial<IMeetingsQuery> {
    let { after, before } = requestQuery,
        query: IMeetingsQuery = {};
    if (after && (after = new Date(after))) query.after = after;
    if (before && (before = new Date(before))) query.before = before;
    return query;
}
