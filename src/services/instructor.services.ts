import { Service, Inject } from 'typedi'
import { EventEmitter } from 'events';
import { Model, Document, Types } from 'mongoose';
import { events } from '../config/constants.config';
import { EUserRoles } from '../types';

@Service()
export default class InstructorService {
    constructor(
        @Inject('models.Instructors') private Instructors: Model<Document>,
        private eventEmitter: EventEmitter
    ) { }

    async createInstructor(instructor: any) {
        if (instructor.password) throw new Error("We don't store passwords around here fella!")

        const newInstructor = await this.Instructors.create(instructor);

        this.eventEmitter.emit(events.user.USER_SIGNUP, { 
            role: EUserRoles.INSTRUCTOR, 
            user: newInstructor
        });

        return newInstructor;
    }

    async findInstructors(where: object = {}, options?: {
        sort?: object,
        skip?: number,
        limit?: number
    }) {
        const users = await this.Instructors
        .find(where)
        .sort(options?.sort)
        .skip(options?.skip || 0)
        .limit(options?.limit || 20)

        return users;
    }

    async findInstructor(where: object) {
        return await this.Instructors.findOne(where)
    }

    async findInstructorById(id: Types.ObjectId) {
        return await this.Instructors.findById(id);
    }

    async findInstructorByEmail(email: string) {
        return await this.Instructors.findOne({ email })
    }

    async updateInstructor(where: object, newInstructor: object) {
        return await this.Instructors.findOneAndUpdate(where, newInstructor);
    }

    async updateInstructorById(id: Types.ObjectId, newInstructor: object) {
        return await this.Instructors.findByIdAndUpdate(id, newInstructor);
    }

    async deleteInstructorById(id: Types.ObjectId) {
        return await this.Instructors.findByIdAndDelete(id);
    }

    async addCourseMetadata({ instructorId, courseId }: {
        instructorId: Types.ObjectId,
        courseId: Types.ObjectId
    }) {
        await this.Instructors.updateOne({_id: instructorId}, {
            $push: { 'meta.courses': courseId }
        });
    }

    async removeCourseMetadata({ instructorId, courseId }: {
        instructorId: Types.ObjectId,
        courseId: Types.ObjectId
    }) {
        await this.Instructors.updateOne({_id: instructorId}, {
            $pull: { 'meta.courses': courseId }
        });
    }
}