import { Service, Inject } from 'typedi'
import { EventEmitter } from 'events';
import { Model, Document, Types } from 'mongoose';
import { events } from '../../../config/constants.config';
import { UserRolesEnum } from '../../../config/types.config';

@Service()
export default class InstructorService {
    constructor(
        private eventEmitter: EventEmitter,
        @Inject('models.Instructors') private Instructors: Model<Document>
    ) { }

    async createInstructor(instructor: any) {
        if (instructor.password) throw new Error("We don't store passwords around here fella!")

        const newInstructor = await this.Instructors.create(instructor);

        this.eventEmitter.emit(events.user.USER_SIGNUP, { 
            role: UserRolesEnum.INSTRUCTOR, 
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

    findInstructor(where: object) {
        return this.Instructors.findOne(where)
    }

    findInstructorById(id: Types.ObjectId) {
        return this.Instructors.findById(id);
    }

    updateInstructor(where: object, newInstructor: object) {
        return this.Instructors.findOneAndUpdate(where, newInstructor);
    }

    updateInstructorById(id: Types.ObjectId, newInstructor: object) {
        return this.Instructors.findByIdAndUpdate(id, newInstructor);
    }

    deleteInstructors(where: object) {
        return this.Instructors.deleteMany(where);
    }

    deleteInstructorById(id: Types.ObjectId) {
        return this.Instructors.findByIdAndDelete(id);
    }

    deleteInstructorsByIds(ids: Types.ObjectId[]) {
        return this.Instructors.deleteMany({_id: {$in: ids}});
    }
}