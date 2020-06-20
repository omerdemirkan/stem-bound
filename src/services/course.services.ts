import { Model, Document, Types } from "mongoose";
import { EventEmitter } from "events";
import { ECourseEvents } from "../types";

export default class CourseService {
    constructor(
        private Courses: Model<Document>,
        private eventEmitter: EventEmitter
    ) {}

    async createCourse(courseData: object = {}) {
        const course: any = await this.Courses.create(courseData);
        this.eventEmitter.emit(ECourseEvents.COURSE_CREATED, course);
        return course;
    }

    async findCourses(where: object) {
        return await this.Courses.find(where);
    }

    async findCoursesByIds(ids: Types.ObjectId[]) {
        return await this.Courses.find({ _id: { $in: ids } });
    }

    async findCourse(where: object) {
        return await this.Courses.findOne(where);
    }

    async findCourseById(id: Types.ObjectId) {
        return await this.Courses.findById(id);
    }

    async updateCourse(where: object, newCourse: object) {
        return await this.Courses.findOneAndUpdate(where, newCourse);
    }

    async updateCourseById(id: Types.ObjectId, newCourse: object) {
        return await this.Courses.findByIdAndUpdate(id, newCourse);
    }

    async deleteCourse(where: object) {
        return await this.Courses.findOneAndDelete(where);
    }

    async deleteCourseById(id: Types.ObjectId) {
        return await this.Courses.findByIdAndDelete(id);
    }

    async addInstructorMetadata({
        instructorIds,
        courseIds,
    }: {
        instructorIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }) {
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
    }) {
        await this.Courses.updateMany(
            { _id: { $in: courseIds } },
            {
                $pull: { "meta.instructors": { $each: instructorIds } },
            }
        );
    }

    async addStudentMetadata({
        studentIds,
        courseIds,
    }: {
        studentIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }) {
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
    }) {
        await this.Courses.updateMany(
            { _id: { $in: courseIds } },
            {
                $pull: { "meta.students": { $each: studentIds } },
            }
        );
    }
}
