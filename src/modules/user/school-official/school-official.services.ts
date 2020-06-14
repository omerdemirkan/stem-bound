import { Service, Inject } from 'typedi';
import { Model, Document, Types } from 'mongoose';
import { EventEmitter } from 'events';
import { events } from '../../../config/constants.config';
import { UserRolesEnum, SchoolDataLocal } from '../../../config/types.config';

@Service()
export default class SchoolOfficialService {
    constructor(
        @Inject('models.SchoolOfficials') private SchoolOfficials: Model<Document>,
        @Inject('models.Schools') private Schools: Model<Document>,
        private eventEmitter: EventEmitter
    ) { }

    async createSchoolOfficial(schoolOfficial: any) {
        if (schoolOfficial.password) throw new Error("We don't store passwords around here fella!")

        const schoolId: string = schoolOfficial.meta.school;
        const [ school, newSchoolOfficial ]: any = await Promise.all([ 
            await this.Schools.findById(schoolId),
            await this.SchoolOfficials.create(schoolOfficial)
        ])

        school.meta.schoolOfficials.push(newSchoolOfficial._id);
        school.save();

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

    findSchoolOfficial(where: object) {
        return this.SchoolOfficials.findOne(where)
    }

    findSchoolOfficialById(id: Types.ObjectId) {
        return this.SchoolOfficials.findById(id);
    }

    findSchoolOfficialByEmail(email: string) {
        return this.SchoolOfficials.findOne({ email })
    }

    updateSchoolOfficial(where: object, newSchoolOfficial: object) {
        return this.SchoolOfficials.findOneAndUpdate(where, newSchoolOfficial);
    }

    updateSchoolOfficialById(id: Types.ObjectId, newSchoolOfficial: object) {
        return this.SchoolOfficials.findByIdAndUpdate(id, newSchoolOfficial);
    }

    deleteSchoolOfficials(where: object) {
        return this.SchoolOfficials.deleteMany(where);
    }

    deleteSchoolOfficialById(id: Types.ObjectId) {
        return this.SchoolOfficials.findByIdAndDelete(id);
    }

    deleteSchoolOfficialsByIds(ids: Types.ObjectId[]) {
        return this.SchoolOfficials.deleteMany({_id: {$in: ids}});
    }
}