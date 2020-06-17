import { Service, Inject } from 'typedi';
import { Model, Document, Types } from 'mongoose';
import { EventEmitter } from 'events';
import { events } from '../config/constants.config';
import { EUserRoles } from '../types';

const { ObjectId } = Types;

@Service()
export default class SchoolOfficialService {
    constructor(
        @Inject('models.SchoolOfficials') private SchoolOfficials: Model<Document>,
        private eventEmitter: EventEmitter
    ) { }

    async createSchoolOfficial(schoolOfficial: any) {
        if (schoolOfficial.password) throw new Error("We don't store passwords around here fella!")

        const newSchoolOfficial = await this.SchoolOfficials.create(schoolOfficial)

        this.eventEmitter.emit(events.user.USER_SIGNUP, { 
            role: EUserRoles.INSTRUCTOR, 
            user: newSchoolOfficial
        });

        return newSchoolOfficial;
    }

    async findSchoolOfficials(where: object = {}, options?: {
        sort?: object,
        skip?: number,
        limit?: number
    }) {
        const students = await this.SchoolOfficials
        .find(where)
        .sort(options?.sort)
        .skip(options?.skip || 0)
        .limit(options?.limit || 20)

        return students;
    }

    async findSchoolOfficial(where: object) {
        return await this.SchoolOfficials.findOne(where)
    }

    async findSchoolOfficialById(id: Types.ObjectId) {
        return await this.SchoolOfficials.findById(id);
    }

    async findSchoolOfficialByEmail(email: string) {
        return await this.SchoolOfficials.findOne({ email })
    }

    async updateSchoolOfficial(where: object, newSchoolOfficial: object) {
        return await this.SchoolOfficials.findOneAndUpdate(where, newSchoolOfficial);
    }

    async updateSchoolOfficialById(id: Types.ObjectId, newSchoolOfficial: object) {
        return await this.SchoolOfficials.findByIdAndUpdate(id, newSchoolOfficial);
    }

    async deleteSchoolOfficial(where: object) {
        return await this.SchoolOfficials.findOneAndDelete(where)
    }

    async deleteSchoolOfficialById(id: Types.ObjectId) {
        return await this.deleteSchoolOfficial({ _id: id })
    }
}