import { Types } from "mongoose";
import { EventEmitter } from "events";
import { emitter } from "../decorators";
import { inject, injectable } from "inversify";
import {
    ECourseEvents,
    ICourse,
    IMeeting,
    IAnnouncement,
    EErrorTypes,
    IQuery,
    IFilterQuery,
    IUpdateQuery,
    ISubDocumentQuery,
    ICourseService,
    IErrorService,
    ECourseVerificationStatus,
    ICourseVerificationStatusUpdate,
} from "../types";
import { SERVICE_SYMBOLS } from "../constants/service.constants";
import { Course } from "../models";

@injectable()
class CourseService implements ICourseService {
    private model = Course;

    @emitter()
    private eventEmitter: EventEmitter;

    constructor(
        @inject(SERVICE_SYMBOLS.ERROR_SERVICE)
        protected errorService: IErrorService
    ) {}

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
        courseData.verificationStatus = ECourseVerificationStatus.UNPUBLISHED;
        const course: ICourse = await this.model.create(courseData);
        this.eventEmitter.emit(ECourseEvents.COURSE_CREATED, course);
        return course;
    }

    async updateCourseVerificationStatus(
        filter: IFilterQuery<ICourse>,
        courseVerificationStatusUpdate: ICourseVerificationStatusUpdate
    ) {
        return await this.updateCourse(filter, {
            verificationStatus: courseVerificationStatusUpdate.status,
            // @ts-ignore
            $push: {
                verificationHistory: {
                    $each: [courseVerificationStatusUpdate],
                    $position: 0,
                },
            },
        });
    }

    async updateCourseVerificationStatusById(
        courseId: Types.ObjectId,
        courseVerificationStatusUpdate: ICourseVerificationStatusUpdate
    ) {
        return await this.updateCourseVerificationStatus(
            { _id: courseId },
            courseVerificationStatusUpdate
        );
    }

    async findCourses(
        query: IQuery<ICourse> = { filter: {} }
    ): Promise<ICourse[]> {
        return await this.model
            .find({
                verificationStatus: ECourseVerificationStatus.VERIFIED,
                ...query.filter,
            })
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
        return await this.model.findOne(filter);
    }

    async findCourseById(id: Types.ObjectId): Promise<ICourse> {
        return await this.findCourse({ _id: id });
    }

    async updateCourse(
        filter: IFilterQuery<ICourse>,
        udpateQuery: IUpdateQuery<ICourse>
    ): Promise<ICourse> {
        return this.model.findOneAndUpdate(filter, udpateQuery, {
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
        return await this.model.findOneAndDelete(filter);
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
                "Coursenot found"
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
                "Coursenot found"
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
        // const course = await this.model.findOne(filter);
        // const meetingIndex = course.meetings.findIndex(
        //     (meeting) => meeting._id.toString() === meetingId.toString()
        // );
        // Object.assign(course.meetings[meetingIndex], meetingData);
        // await course.save();
        // return course.meetings[meetingIndex];
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
                "Coursenot found"
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
        const course = await this.model.findByIdAndUpdate(
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
        await this.model.updateMany(
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
        await this.model.updateMany(
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
        await this.model.updateMany(
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
        await this.model.updateMany(
            { _id: { $in: courseIds } },
            {
                $pullAll: { "meta.students": studentIds },
            }
        );
    }
}

export default CourseService;
