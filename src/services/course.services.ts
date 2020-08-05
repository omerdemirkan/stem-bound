import { Model, Types } from "mongoose";
import { EventEmitter } from "events";
import { ECourseEvents, ICourse, IMeeting, IAnnouncement } from "../types";

export default class CourseService {
    constructor(
        private Courses: Model<ICourse>,
        private eventEmitter: EventEmitter
    ) {}

    async createCourse(courseData: ICourse): Promise<ICourse> {
        const course: ICourse = await this.Courses.create(courseData);
        this.eventEmitter.emit(ECourseEvents.COURSE_CREATED, course);
        return course;
    }

    async findCourses(
        where: object = {},
        options?: {
            sort?: object;
            skip?: number;
            limit?: number;
        }
    ): Promise<ICourse[]> {
        return await this.Courses.find(where)
            .sort(options?.sort)
            .skip(options?.skip || 0)
            .limit(options?.limit ? Math.min(options?.limit, 20) : 20);
    }

    async findCoursesByIds(ids: Types.ObjectId[]): Promise<ICourse[]> {
        return await this.Courses.find({ _id: { $in: ids } });
    }

    async findCourse(where: object): Promise<ICourse> {
        return await this.Courses.findOne(where);
    }

    async findCourseById(id: Types.ObjectId): Promise<ICourse> {
        return await this.Courses.findById(id);
    }

    async updateCourse(
        where: object,
        newCourse: Partial<ICourse>
    ): Promise<ICourse> {
        return await this.Courses.findOneAndUpdate(where, newCourse, {
            new: true,
        });
    }

    async updateCourseById(
        id: Types.ObjectId,
        newCourse: object
    ): Promise<ICourse> {
        return await this.Courses.findByIdAndUpdate(id, newCourse, {
            new: true,
        });
    }

    async deleteCourse(where: object): Promise<ICourse> {
        return await this.Courses.findOneAndDelete(where);
    }

    async deleteCourseById(id: Types.ObjectId): Promise<ICourse> {
        return await this.Courses.findByIdAndDelete(id);
    }

    async createMeetings(
        courseId: Types.ObjectId,
        meetings: IMeeting[]
    ): Promise<IMeeting[]> {
        let course = await this.Courses.findById(courseId);
        course.meetings = course.meetings.concat(meetings);
        await course.save();
        const meetingStartDates = meetings.map((meeting) =>
            new Date(meeting.start).toString()
        );
        return course.meetings.filter((meeting: IMeeting) =>
            meetingStartDates.includes(meeting.start.toString())
        );
    }

    async updateMeeting({
        courseId,
        meetingId,
        meetingData,
    }: {
        courseId: Types.ObjectId;
        meetingId: Types.ObjectId;
        meetingData: Partial<IMeeting>;
    }): Promise<IMeeting> {
        const course = await this.findCourseById(courseId);
        const meetingIndex = course.meetings.findIndex(
            (meeting) => meeting._id.toString() === meetingId.toString()
        );
        Object.assign(course.meetings[meetingIndex], meetingData);
        await course.save();
        return course.meetings[meetingIndex];
    }

    async deleteMeeting({
        courseId,
        meetingId,
    }: {
        courseId: Types.ObjectId;
        meetingId: Types.ObjectId;
    }): Promise<IMeeting> {
        const course = await this.Courses.findOneAndUpdate(
            { _id: courseId },
            {
                $pull: { meetings: { _id: meetingId } },
            }
        );
        return course.meetings.find(
            (meeting: IMeeting) =>
                meeting._id.toString() === meetingId.toString()
        );
    }

    async createAnnouncement(
        announcementData,
        { courseId }: { courseId: Types.ObjectId }
    ): Promise<IAnnouncement> {
        const course = await this.Courses.findById(courseId);
        course.announcements.unshift(announcementData);
        await course.save();
        return course.announcements[0];
    }

    async updateAnnouncement(
        announcementData,
        {
            courseId,
            announcementId,
        }: { courseId: Types.ObjectId; announcementId: Types.ObjectId }
    ): Promise<IAnnouncement> {
        const course = await this.Courses.findById(courseId);
        const announcementIndex = course.announcements.findIndex(
            (announcement) =>
                announcement._id.toString() === announcementId.toString()
        );
        Object.assign(
            course.announcements[announcementIndex],
            announcementData
        );
        await course.save();
        return course.announcements[announcementIndex];
    }

    async deleteAnnouncement({
        courseId,
        announcementId,
    }: {
        courseId: Types.ObjectId;
        announcementId: Types.ObjectId;
    }) {
        const course = await this.Courses.findByIdAndUpdate(
            courseId,
            {
                $pull: { announcements: { _id: announcementId.toString() } },
            },
            { new: false }
        );
        return course.announcements.find(
            (announcement) =>
                announcement._id.toString() === announcementId.toString()
        );
    }

    async addInstructorMetadata({
        instructorIds,
        courseIds,
    }: {
        instructorIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }): Promise<void> {
        await this.Courses.updateMany(
            { _id: { $in: courseIds } },
            {
                $addToSet: { "meta.instructors": { $each: instructorIds } },
            }
        );
    }

    async removeInstructorMetadata({
        instructorIds,
        courseIds,
    }: {
        instructorIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }): Promise<void> {
        await this.Courses.updateMany(
            { _id: { $in: courseIds } },
            {
                $pullAll: { "meta.instructors": instructorIds },
            }
        );
    }

    async addStudentMetadata({
        studentIds,
        courseIds,
    }: {
        studentIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }): Promise<void> {
        await this.Courses.updateMany(
            { _id: { $in: courseIds } },
            {
                $addToSet: { "meta.students": { $each: studentIds } },
            }
        );
    }

    async removeStudentMetadata({
        studentIds,
        courseIds,
    }: {
        studentIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }): Promise<void> {
        await this.Courses.updateMany(
            { _id: { $in: courseIds } },
            {
                $pullAll: { "meta.students": studentIds },
            }
        );
    }
}
