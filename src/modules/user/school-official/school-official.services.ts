import { Service, Inject } from 'typedi';
import { Model, Document, Types } from 'mongoose';
import { EventEmitter } from 'events';
import { events } from '../../../config/constants.config';
import { UserRolesEnum } from '../../../config/types.config';
import SchoolService from '../../school/school.services';

const { ObjectId } = Types;

@Service()
export default class SchoolOfficialService {
    constructor(
        @Inject('models.SchoolOfficials') private SchoolOfficials: Model<Document>,
        private eventEmitter: EventEmitter,
        private schoolService: SchoolService
    ) { }

    async createSchoolOfficial(schoolOfficial: any) {
        if (schoolOfficial.password) throw new Error("We don't store passwords around here fella!")

        const schoolId: string = schoolOfficial.meta.school;
        const newSchoolOfficial = await this.SchoolOfficials.create(schoolOfficial)
        
        await this.schoolService.addSchoolOfficialMetadata({
            schoolId: ObjectId(schoolId),
            schoolOfficialId: newSchoolOfficial._id
        })

        this.eventEmitter.emit(events.user.USER_SIGNUP, { 
            role: UserRolesEnum.INSTRUCTOR, 
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

    async deleteSchoolOfficials(where: object) {
        return await this.SchoolOfficials.deleteMany(where);
    }

    async deleteSchoolOfficial(where: object) {
        const schoolOfficial: any = await this.SchoolOfficials.findOneAndDelete(where);

        const schoolId: string = schoolOfficial.meta.school;
        await this.schoolService.removeSchoolOfficialMetadata({
            schoolId: ObjectId(schoolId),
            schoolOfficialId: schoolOfficial._id
        })

        return schoolOfficial;
    }

    async deleteSchoolOfficialById(id: Types.ObjectId) {
        return await this.deleteSchoolOfficial({ _id: id })
    }

    async deleteSchoolOfficialsByIds(ids: Types.ObjectId[]) {
        return this.deleteSchoolOfficials({_id: {$in: ids}});
    }
}