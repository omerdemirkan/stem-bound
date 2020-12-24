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

    private configureMeetingsQuery(
        course: ICourse,
        query: ISubDocumentQuery<IMeeting>
    ) {
        const limit = +query.limit ? Math.min(+query.limit, 20) : 20,
            skip = +query.skip || 0;
        let filter = query.filter || (() => true),
            sort =
                query.sort ||
                ((a, b) =>
                    new Date(b.start).getTime() - new Date(a.start).getTime());

        return course.meetings
            .sort(sort)
            .filter(filter)
            .slice(skip, limit + 1);
    }

    private configureAnnouncementsQuery(
        course: ICourse,
        query: ISubDocumentQuery<IAnnouncement>
    ) {
        const limit = +query.limit ? Math.min(+query.limit, 20) : 20,
            skip = +query.skip || 0;
        let filter = query.filter || (() => true),
            sort =
                query.sort ||
                ((a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime());

        return course.announcements
            .sort(sort)
            .filter(filter)
            .slice(skip, limit + 1);
    }

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

    async findMeetings(
        courseFilter: IFilterQuery<ICourse>,
        query: ISubDocumentQuery<IMeeting> = {}
    ) {
        const course = await this.findCourse(courseFilter);
        if (!course)
            this.errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );

        return this.configureMeetingsQuery(course, query);
    }

    async findMeetingByCourseId({
        courseId,
        meetingId,
    }: {
        courseId: Types.ObjectId;
        meetingId: Types.ObjectId;
    }): Promise<IMeeting> {
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
        filter: IFilterQuery<ICourse>,
        meetings: IMeeting[]
    ): Promise<IMeeting[]> {
        const course = await this.updateCourse(filter, {
            // @ts-ignore
            $push: { meetings: { $each: meetings, $sort: { start: -1 } } },
        });
        const meetingDatesSet = new Set<string>();
        meetings.forEach(function (meeting) {
            meetingDatesSet.add(new Date(meeting.start).toString());
        });
        return course.meetings.filter((meeting: IMeeting) =>
            meetingDatesSet.has(meeting.start.toString())
        );
    }

    async createMeetingsByCourseId(
        courseId: Types.ObjectId,
        meetings: IMeeting[]
    ): Promise<IMeeting[]> {
        return await this.createMeetings({ _id: courseId }, meetings);
    }

    async updateMeeting(
        filter: IFilterQuery<ICourse>,
        meetingId: Types.ObjectId,
        meetingData: Partial<IMeeting>
    ): Promise<IMeeting> {
        const course = await this.updateCourse(
            { ...filter, "meetings._id": meetingId },
            {
                $set: { "meetings.$": meetingData },
            }
        );
        const meetingIndex = course.meetings.findIndex(
            (meeting) => meeting._id.toString() === meetingId.toString()
        );
        return course.meetings[meetingIndex];
    }

    async updateMeetingByCourseId(
        {
            courseId,
            meetingId,
        }: { courseId: Types.ObjectId; meetingId: Types.ObjectId },
        meetingData: Partial<IMeeting>
    ): Promise<IMeeting> {
        return await this.updateMeeting(
            { _id: courseId },
            meetingId,
            meetingData
        );
    }

    async deleteMeeting(
        filter: IFilterQuery<ICourse>,
        meetingId: Types.ObjectId
    ): Promise<IMeeting> {
        const course = await this.updateCourse(filter, {
            // @ts-ignore
            $pull: { meetings: { _id: meetingId } },
        });
        return course.meetings.find(
            (meeting: IMeeting) =>
                meeting._id.toString() === meetingId.toString()
        );
    }

    async deleteMeetingByCourseId({
        meetingId,
        courseId,
    }: {
        meetingId: Types.ObjectId;
        courseId: Types.ObjectId;
    }) {
        return await this.deleteMeeting({ _id: courseId }, meetingId);
    }

    async findAnnouncements(
        courseFilter: IFilterQuery<ICourse>,
        query: ISubDocumentQuery<IAnnouncement> = {}
    ) {
        const course = await this.findCourse(courseFilter);
        return this.configureAnnouncementsQuery(course, query);
    }

    async findAnnouncementsByCourseId(
        courseId: Types.ObjectId,
        query: ISubDocumentQuery<IAnnouncement> = {}
    ) {
        return await this.findAnnouncements({ _id: courseId }, query);
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
        const course = await this.updateCourse(
            { _id: courseId },
            {
                $push: {
                    announcements: {
                        // @ts-ignore
                        $each: [announcementData],
                        $sort: { createdAt: -1 },
                    },
                },
            }
        );
        const announcement = course.announcements[0];
        this.eventEmitter.emit(ECourseEvents.COURSE_ANNOUNCEMENT_CREATED, {
            announcement,
            course,
        });
        return announcement;
    }

    async updateAnnouncement(
        filter: IFilterQuery<ICourse>,
        announcementId: Types.ObjectId,
        announcementData: Partial<IAnnouncement>
    ): Promise<IAnnouncement> {
        const course = await this.updateCourse(
            {
                ...filter,
                "announcements._id": announcementId,
            },
            { $set: { "announcements.$.text": announcementData.text } }
        );
        const announcementIndex = course.announcements.findIndex(
            (announcement) =>
                announcement._id.toString() === announcementId.toString()
        );
        return course.announcements[announcementIndex];
    }

    async updateAnnouncementByCourseId(
        {
            courseId,
            announcementId,
        }: {
            courseId: Types.ObjectId;
            announcementId: Types.ObjectId;
        },
        announcementData: Partial<IAnnouncement>
    ): Promise<IAnnouncement> {
        return await this.updateAnnouncement(
            { _id: courseId },
            announcementId,
            announcementData
        );
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
