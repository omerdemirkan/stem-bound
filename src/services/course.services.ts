import { Model, Document, Types } from 'mongoose';
import { EventEmitter } from 'events';
import { ECourseEvents } from '../types';

export default class CourseService {
    constructor(
        private Courses: Model<Document>,
        private eventEmitter: EventEmitter
    ) { }

    async createCourse(courseData: object = {}) {
        const course: any = await this.Courses.create(courseData);
        this.eventEmitter.emit(ECourseEvents.COURSE_CREATED, course)
        return course;
    }

    async findCourses(where: object) {
        return await this.Courses.find(where);
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
        return await this.Courses.findByIdAndDelete(id)
    }

    async addInstructorMetadata({ instructorId, courseId }: {
        instructorId: Types.ObjectId,
        courseId: Types.ObjectId
    }) {
        await this.Courses.updateOne({ _id: courseId }, {
            $push: { 'meta.instructors': instructorId }
        })
    }

    async removeInstructorMetadata({ instructorId, courseId }: {
        instructorId: Types.ObjectId,
        courseId: Types.ObjectId
    }) {
        await this.Courses.updateOne({ _id: courseId }, {
            $pull: { 'meta.instructors': instructorId }
        })
    }

    async addStudentMetadata({ studentId, courseId }: {
        studentId: Types.ObjectId,
        courseId: Types.ObjectId
    }) {
        await this.Courses.updateOne({ _id: courseId }, {
            $push: { 'meta.students': studentId }
        })
    }

    async removeStudentMetadata({ studentId, courseId }: {
        studentId: Types.ObjectId,
        courseId: Types.ObjectId
    }) {
        await this.Courses.updateOne({ _id: courseId }, {
            $pull: { 'meta.students': studentId }
        })
    }
}