import { Service, Inject } from 'typedi';
import { Model, Document, Types } from 'mongoose';
import { EventEmitter } from 'events';
import { events } from '../../../config/constants.config';

@Service()
export default class StudentService {
    constructor(
        @Inject('models.Students') private Students: Model<Document>,
        private eventEmitter: EventEmitter
    ) { }

    async createStudent(Student: object) {
        const newStudent = await this.Students.create(Student);
        this.eventEmitter.emit(events.user.USER_SIGNUP);
        return newStudent;
    }

    async findStudents(where: object = {}, options?: {
        sort: object,
        skip: number,
        limit: number
    }) {
        const users = await this.Students
        .find(where)
        .sort(options?.sort)
        .skip(options?.skip || 0)
        .limit(options?.limit || 20)

        return users;
    }

    findStudent(where: object) {
        return this.Students.findOne(where)
    }

    findStudentById(id: Types.ObjectId) {
        return this.Students.findById(id);
    }

    updateStudent(where: object, newStudent: object) {
        return this.Students.findOneAndUpdate(where, newStudent);
    }

    updateStudentById(id: Types.ObjectId, newStudent: object) {
        return this.Students.findByIdAndUpdate(id, newStudent);
    }

    deleteStudents(where: object) {
        return this.Students.deleteMany(where);
    }

    deleteStudentById(id: Types.ObjectId) {
        return this.Students.findByIdAndDelete(id);
    }

    deleteStudentsByIds(ids: Types.ObjectId[]) {
        return this.Students.deleteMany({_id: {$in: ids}});
    }
}