import { Service, Inject } from 'typedi'
import { EventEmitter } from 'events';
import { Model, Document, Types } from 'mongoose';

@Service()
export class InstructorService {
    constructor(
        @Inject('eventEmitter') private eventEmitter: EventEmitter,
        @Inject('models.Instructor') private Instructor: Model<Document>
    ) { }

    async createInstructor(instructor: object) {
        return this.Instructor.create(instructor)
    }

    async findInstructors(where: object = {}, options?: {
        sort: object,
        skip: number,
        limit: number
    }) {
        const users = await this.Instructor
        .find(where)
        .sort(options?.sort)
        .skip(options?.skip || 0)
        .limit(options?.limit || 0)

        return users;
    }

    findInstructor(where: object) {
        return this.Instructor.findOne(where)
    }

    findInstructorById(id: Types.ObjectId) {
        return this.Instructor.findById(id);
    }

    updateInstructor(where: object, newInstructor: object) {
        return this.Instructor.findOneAndUpdate(where, newInstructor);
    }

    updateInstructorById(id: Types.ObjectId, newInstructor: object) {
        return this.Instructor.findByIdAndUpdate(id, newInstructor);
    }

    deleteInstructors(where: object) {
        return this.Instructor.deleteMany(where);
    }

    deleteInstructorById(id: Types.ObjectId) {
        return this.Instructor.findByIdAndDelete(id);
    }

    deleteInstructorsByIds(ids: Types.ObjectId[]) {
        return this.Instructor.deleteMany({_id: {$in: ids}});
    }
}