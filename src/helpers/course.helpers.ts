import { ICourse, ITokenPayload, IMessage, IMeeting } from "../types";

export function configureCourseQuery(queryParams: {}) {}

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
