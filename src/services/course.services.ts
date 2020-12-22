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
    IUpdateQuery,
    ISubDocumentQuery,
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

    async findCoursesByInstructorId(
        instructorId: Types.ObjectId,
        query: IQuery<ICourse> = { filter: {} }
    ) {
        query.filter["meta.instructors"] = instructorId;
        return await this.findCourses(query);
    }

    async findCoursesByStudentId(
        studentId: Types.ObjectId,
        query: IQuery<ICourse> = { filter: {} }
    ) {
        query.filter["meta.students"] = studentId;
        return await this.findCourses(query);
    }

    async findCoursesBySchoolId(
        schoolId: Types.ObjectId,
        query: IQuery<ICourse> = { filter: {} }
    ) {
        query.filter["meta.school"] = schoolId;
        return await this.findCourses(query);
    }

    async findCourse(filter: IFilterQuery<ICourse>): Promise<ICourse> {
        return await this.Course.findOne(filter);
    }

    async findCourseById(id: Types.ObjectId): Promise<ICourse> {
        return await this.findCourse({ _id: id });
    }

    async updateCourse(
        filter: IFilterQuery<ICourse>,
        udpateQuery: IUpdateQuery<ICourse>
    ): Promise<ICourse> {
        return this.Course.findOneAndUpdate(filter, udpateQuery, {
            new: true,
            runValidators: true,
        });
    }

    async updateCourseById(
        id: Types.ObjectId,
        newCourse: IUpdateQuery<ICourse>
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
        query: ISubDocumentQuery<IMeeting> = {}
    ) {
        const course = await this.findCourseById(courseId);
        if (!course) {
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        const limit = +query.limit ? Math.min(+query.limit, 20) : 20,
            skip = +query.skip || 0,
            before = query.before ? new Date(query.before) : null,
            after = query.after ? new Date(query.after) : null;
        let filter = query.filter || ((meeting) => true),
            sort =
                query.sort ||
                ((a, b) =>
                    new Date(b.start).getTime() - new Date(a.start).getTime());

        if (before)
            filter = (meeting: IMeeting) =>
                filter(meeting) && new Date(meeting.start) < before;
        if (after)
            filter = (meeting: IMeeting) =>
                filter(meeting) && new Date(meeting.start) > before;

        return course.meetings
            .sort(sort)
            .filter(filter)
            .slice(skip, limit + 1);
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
        course.meetings.sort(
            (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
        );
        await course.save();

        const meetingDatesSet = new Set<string>();
        meetings.forEach(function (meeting) {
            meetingDatesSet.add(new Date(meeting.start).toString());
        });
        return course.meetings.filter((meeting: IMeeting) =>
            meetingDatesSet.has(meeting.start.toString())
        );
    }

    async updateMeetingByCourseId(
        {
            courseId,
            meetingId,
        }: { courseId: Types.ObjectId; meetingId: Types.ObjectId },
        meetingData: Partial<IMeeting>
    ) {
        return await this.updateMeeting(
            { _id: courseId },
            meetingId,
            meetingData
        );
    }

    async updateMeeting(
        filter: IFilterQuery<ICourse>,
        meetingId: Types.ObjectId,
        meetingData: Partial<IMeeting>
    ): Promise<IMeeting> {
        const course = await this.findCourse(filter);
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
