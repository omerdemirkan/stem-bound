import { Service, Inject } from 'typedi';
import { Model, Document, Types } from 'mongoose';
import { EventEmitter } from 'events';
import { events } from '../../../config/constants.config';
import { UserRolesEnum } from '../../../config/types.config';
import SchoolService from '../../school/school.services';

const { ObjectId } = Types;

@Service()
export default class StudentService {
    constructor(
        @Inject('models.Students') private Students: Model<Document>,
        private eventEmitter: EventEmitter,
        private schoolService: SchoolService
    ) { }

    async createStudent(student: any) {
        if (student.password) throw new Error("We don't store passwords around here fella!")

        const schoolId: Types.ObjectId = ObjectId(student.meta.school);
        
        const newStudent = await this.Students.create(student);
        await this.schoolService.addStudentMetadata({
            studentId: newStudent._id,
            schoolId
        });

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
        const student: any = await this.Students.findOneAndDelete(where);

        const schoolId: Types.ObjectId = ObjectId(student.meta.school);
        await this.schoolService.removeStudentMetadata({
            studentId: student._id,
            schoolId
        });

        return student;
    }

    async deleteStudentById(id: Types.ObjectId) {
        return await this.deleteStudent({ _id: id })
    }
}