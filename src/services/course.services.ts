import { Model, Types } from "mongoose";
import { EventEmitter } from "events";
import {
    ECourseEvents,
    ICourse,
    IMeeting,
    IAnnouncement,
    EModels,
    EErrorTypes,
    IQuery,
    IFilterQuery,
} from "../types";
import { model, emitter } from "../decorators";
import { ErrorService } from ".";

export default class CourseService {
    @model(EModels.COURSE)
    private Course: Model<ICourse>;

    @emitter()
    private eventEmitter: EventEmitter;

    constructor(private errorService: ErrorService) {}

    async createCourse(courseData: ICourse): Promise<ICourse> {
        courseData.verified = false;
        const course: ICourse = await this.Course.create(courseData);
        this.eventEmitter.emit(ECourseEvents.COURSE_CREATED, course);
        return course;
    }

    async verifyCourse(filter: IFilterQuery<ICourse>) {
        return await this.updateCourse(filter, { verified: true });
    }

    async verifyCourseById(courseId: Types.ObjectId) {
        return await this.verifyCourse({ _id: courseId });
    }

    async findCourses(
        query: IQuery<ICourse> = { filter: {} }
    ): Promise<ICourse[]> {
        return await this.Course.find({ verified: true, ...query.filter })
            .sort(query.sort)
            .skip(query.skip || 0)
            .limit(query.limit ? Math.min(query.limit, 20) : 20);
    }

    async findCoursesByIds(
        ids: Types.ObjectId[],
        options?: { unverified: boolean }
    ): Promise<ICourse[]> {
        return await this.findCourses({
            filter: {
                _id: { $in: ids },
                verified: !options?.unverified,
            },
        });
    }

    async findCourse(filter: IFilterQuery<ICourse>): Promise<ICourse> {
        return await this.Course.findOne(filter);
    }

    async findCourseById(id: Types.ObjectId): Promise<ICourse> {
        return await this.findCourse({ _id: id });
    }

    async updateCourse(
        filter: IFilterQuery<ICourse>,
        newCourse: Partial<ICourse>
    ): Promise<ICourse> {
        const course = await this.findCourse(filter);
        Object.assign(course, newCourse);
        await course.save();
        return course;
    }

    async updateCourseById(
        id: Types.ObjectId,
        newCourse: Partial<ICourse>
    ): Promise<ICourse> {
        return await this.updateCourse({ _id: id }, newCourse);
    }

    async deleteCourse(filter: IFilterQuery<ICourse>): Promise<ICourse> {
        return await this.Course.findOneAndDelete(filter);
    }

    async deleteCourseById(id: Types.ObjectId): Promise<ICourse> {
        return await this.deleteCourse({ _id: id });
    }

    async findMeetingsByCourseId(
        courseId: Types.ObjectId,
        options?: {
            skip?: number;
            limit?: number;
            before?: Date;
            after?: Date;
        }
    ) {
        const course = await this.findCourseById(courseId);
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        const limit = +options?.limit ? Math.min(+options.limit, 20) : 20;
        const skip = +options?.skip || 0;

        if (options?.before) {
            const before = new Date(options.before);
            course.meetings = course.meetings.filter(
                (meeting) => new Date(meeting.start) < before
            );
        }
        if (options?.after) {
            const after = new Date(options.after);
            course.meetings = course.meetings.filter(
                (meeting) => new Date(meeting.start) > after
            );
        }

        const meetings = course.meetings.slice(skip, limit + 1);

        return meetings;
    }

    async findMeetingById({
        courseId,
        meetingId,
    }: {
        courseId: Types.ObjectId;
        meetingId: Types.ObjectId;
    }) {
        const course = await this.findCourseById(courseId);
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        const meeting = course.meetings.find(
            (meeting: IMeeting) =>
                meeting._id.toString() === meetingId.toString()
        );
        return meeting;
    }

    async createMeetings(
        meetings: IMeeting[],
        courseId: Types.ObjectId
    ): Promise<IMeeting[]> {
        let course = await this.findCourseById(courseId);
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        course.meetings = meetings.concat(course.meetings);
        // @ts-ignore
        course.meetings.sort((a, b) => new Date(b.start) - new Date(a.start));
        await course.save();

        const meetingDatesObj = {};
        meetings.forEach(function (meeting) {
            meetingDatesObj[new Date(meeting.start).toString()] = true;
        });
        return course.meetings.filter(
            (meeting: IMeeting) => meetingDatesObj[meeting.start.toString()]
        );
    }

    async updateMeeting({
        courseId,
        meetingId,
        requestingUserId,
        meetingData,
    }: {
        courseId: Types.ObjectId;
        meetingId: Types.ObjectId;
        requestingUserId: Types.ObjectId;
        meetingData: Partial<IMeeting>;
    }): Promise<IMeeting> {
        const course = await this.Course.findOne({
            _id: courseId,
            "meta.instructors": requestingUserId.toString(),
        });
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
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
        requestingUserId,
    }: {
        courseId: Types.ObjectId;
        meetingId: Types.ObjectId;
        requestingUserId: Types.ObjectId;
    }): Promise<IMeeting> {
        const course = await this.Course.findOneAndUpdate(
            { _id: courseId, "meta.instructors": requestingUserId },
            {
                $pull: { meetings: { _id: meetingId } },
            },
            { new: false }
        );
        return course.meetings.find(
            (meeting: IMeeting) =>
                meeting._id.toString() === meetingId.toString()
        );
    }

    async findAnnouncementsByCourseId(
        courseId: Types.ObjectId,
        options?: {
            skip?: number;
            limit?: number;
        }
    ) {
        let course = await this.findCourseById(courseId);
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        const limit = +options?.limit ? Math.min(+options.limit, 20) : 20;
        const skip = +options?.skip || 0;
        const announcements = course.announcements.slice(skip, limit + 1);
        return announcements;
    }

    async findAnnouncementById({
        courseId,
        announcementId,
    }: {
        courseId: Types.ObjectId;
        announcementId: Types.ObjectId;
    }) {
        const course = await this.findCourseById(courseId);
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        const announcement = course.announcements.find(
            (announcement) =>
                announcement._id.toString() === announcementId.toString()
        );
        return announcement;
    }

    async createAnnouncement(
        announcementData: Partial<IAnnouncement>,
        courseId: Types.ObjectId
    ): Promise<IAnnouncement> {
        const course = await this.Course.findOne({
            _id: courseId,
            "meta.instructors": { $in: announcementData.meta.from },
        });

        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        course.announcements.unshift(announcementData as any);
        await course.save();

        const announcement = course.announcements[0];

        this.eventEmitter.emit(ECourseEvents.COURSE_ANNOUNCEMENT_CREATED, {
            announcement,
            course,
        });

        return announcement;
    }

    async updateAnnouncement({
        courseId,
        announcementId,
        announcementData,
    }: {
        courseId: Types.ObjectId;
        announcementId: Types.ObjectId;
        announcementData: Partial<IAnnouncement>;
    }): Promise<IAnnouncement> {
        const course = await this.Course.findById(courseId);
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
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

    async deleteAnnouncementById({
        courseId,
        announcementId,
    }: {
        courseId: Types.ObjectId;
        announcementId: Types.ObjectId;
    }) {
        const course = await this.Course.findByIdAndUpdate(
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
        await this.Course.updateMany(
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
        await this.Course.updateMany(
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
        await this.Course.updateMany(
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
        await this.Course.updateMany(
            { _id: { $in: courseIds } },
            {
                $pullAll: { "meta.students": studentIds },
            }
        );
    }
}
