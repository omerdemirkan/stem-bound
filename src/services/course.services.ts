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

    async findCourses(
        where: object = {},
        options?: {
            sort?: object;
            skip?: number;
            limit?: number;
        }
    ) {
        return await this.Courses.find(where)
            .sort(options?.sort)
            .skip(options?.skip || 0)
            .limit(options?.limit ? Math.min(options?.limit, 20) : 20);
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
        return await this.Courses.findOneAndUpdate(where, newCourse, {
            new: true,
        });
    }

    async updateCourseById(id: Types.ObjectId, newCourse: object) {
        return await this.Courses.findByIdAndUpdate(id, newCourse, {
            new: true,
        });
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
                $pullAll: { "meta.students": studentIds },
            }
        );
    }

    // async findCoursesBySchoolLocation({
    //     coordinates,
    // }: {
    //     coordinates: number[];
    // }) {
    //     return await this.Courses.aggregate([
    //         {
    //             $lookup: {
    //                 from: "schools",
    //                 localField: "meta.school",
    //                 foreignField: "_id",
    //                 as: "school",
    //             },
    //         },
    //         {
    //             $geoNear: {
    //                 near: {
    //                     type: "Point",
    //                     coordinates,
    //                 },
    //                 distanceField: "distance.calculated",
    //                 key: "school.location.geoJSON",
    //             },
    //         },
    //     ]);
    // }
}
