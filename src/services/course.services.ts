import { Model, Document, Types } from "mongoose";
import { EventEmitter } from "events";
import { ECourseEvents, ICourse } from "../types";

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
                $push: { "meta.instructors": { $each: instructorIds } },
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
                $push: { "meta.students": { $each: studentIds } },
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
