import { Service, Inject } from 'typedi';
import { Model, Document, Types } from 'mongoose';
import { EventEmitter } from 'events';
import { events } from '../../../config/constants.config';
import { UserRolesEnum } from '../../../config/types.config';

@Service()
export default class StudentService {
    constructor(
        @Inject('models.Students') private Students: Model<Document>,
        private eventEmitter: EventEmitter
    ) { }

    async createStudent(student: any) {
        if (student.password) throw new Error("We don't store passwords around here fella!")
        
        const newStudent = await this.Students.create(student);

        this.eventEmitter.emit(events.user.USER_SIGNUP, { 
            role: UserRolesEnum.INSTRUCTOR, 
            user: newStudent
        });

        return newStudent;
    }

    async findStudents(where: object = {}, options?: {
        sort?: object,
        skip?: number,
        limit?: number
    }) {
        const students = await this.Students
        .find(where)
        .sort(options?.sort)
        .skip(options?.skip || 0)
        .limit(options?.limit || 20)

        return students;
    }

    async findStudent(where: object) {
        return await this.Students.findOne(where)
    }

    async findStudentById(id: Types.ObjectId) {
        return await this.Students.findById(id);
    }

    async findStudentByEmail(email: string) {
        return await this.Students.findOne({ email })
    }

    async updateStudent(where: object, newStudent: object) {
        return await this.Students.findOneAndUpdate(where, newStudent);
    }

    async updateStudentById(id: Types.ObjectId, newStudent: object) {
        return await this.Students.findByIdAndUpdate(id, newStudent);
    }

    async deleteStudent(where: object) {
        return await this.Students.findOneAndDelete(where);
    }

    async deleteStudentById(id: Types.ObjectId) {
        return await this.deleteStudent({ _id: id })
    }
}