import { Model, Types } from "mongoose";
import { EventEmitter } from "events";
import {
    ECourseEvents,
    ICourse,
    IMeeting,
    IAnnouncement,
    EModels,
    EErrorTypes,
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
        const course: ICourse = await this.Course.create(courseData);
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
        return await this.Course.find(where)
            .sort(options?.sort)
            .skip(options?.skip || 0)
            .limit(options?.limit ? Math.min(options?.limit, 20) : 20);
    }

    async findCoursesByIds(ids: Types.ObjectId[]): Promise<ICourse[]> {
        return await this.Course.find({ _id: { $in: ids } });
    }

    async findCourse(where: object): Promise<ICourse> {
        return await this.Course.findOne(where);
    }

    async findCourseById(id: Types.ObjectId): Promise<ICourse> {
        return await this.Course.findById(id);
    }

    async updateCourse(
        where: object,
        newCourse: Partial<ICourse>
    ): Promise<ICourse> {
        return await this.Course.findOneAndUpdate(where, newCourse, {
            new: true,
        });
    }

    async updateCourseById(
        id: Types.ObjectId,
        newCourse: object
    ): Promise<ICourse> {
        return await this.Course.findByIdAndUpdate(id, newCourse, {
            new: true,
        });
    }

    async deleteCourse(where: object): Promise<ICourse> {
        return await this.Course.findOneAndDelete(where);
    }

    async deleteCourseById(id: Types.ObjectId): Promise<ICourse> {
        return await this.Course.findByIdAndDelete(id);
    }

    async findMeetingsByCourseId(
        courseId: Types.ObjectId,
        {
            skip,
            limit,
        }: {
            skip?: number;
            limit?: number;
        } = {}
    ) {
        let course = await this.findCourseById(courseId);
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        limit = +limit ? Math.min(+limit, 20) : 20;
        skip = +skip || 0;
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
        { courseId }: { courseId: Types.ObjectId }
    ): Promise<IMeeting[]> {
        let course = await this.Course.findById(courseId);
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

    async updateMeeting(
        meetingData: Partial<IMeeting>,
        {
            courseId,
            meetingId,
            requestUserId,
        }: {
            courseId: Types.ObjectId;
            meetingId: Types.ObjectId;
            requestUserId: Types.ObjectId;
        }
    ): Promise<IMeeting> {
        const course = await this.Course.findOne({
            _id: courseId,
            "meta.instructors": requestUserId.toString(),
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
        requestUserId,
    }: {
        courseId: Types.ObjectId;
        meetingId: Types.ObjectId;
        requestUserId: Types.ObjectId;
    }): Promise<IMeeting> {
        const course = await this.Course.findOneAndUpdate(
            { _id: courseId, "meta.instructors": requestUserId },
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
        {
            skip,
            limit,
        }: {
            skip?: number;
            limit?: number;
        } = {}
    ) {
        let course = await this.findCourseById(courseId);
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        limit = +limit ? Math.min(+limit, 20) : 20;
        skip = +skip || 0;
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
        announcementData,
        { courseId }: { courseId: Types.ObjectId }
    ): Promise<IAnnouncement> {
        const course = await this.findCourseById(courseId);
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
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
