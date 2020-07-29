import { ICourse, ITokenPayload, IMessage } from "../types";

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
            .map((id) => id.toHexString())
            .includes(payload.user._id)
            ? []
            : course.announcements.filter(
                  (announcement) =>
                      !announcement.meta.readBy
                          .map((id) => id.toHexString())
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
    };
}

export function configureMessageArrayResponse(
    messages: IMessage[],
    {
        query,
    }: {
        query: any;
    }
) {
    const limit = Math.min(+query.limit, 20);
    const skip = +query.skip || 0;

    return messages.slice(skip, limit + 1);
}
