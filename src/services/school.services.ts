import { Service, Inject, Container } from 'typedi';
import { Model, Document, Types, MongooseFilterQuery } from 'mongoose';
import { refreshSchoolDatabase } from '../jobs/school.jobs';
import { SchoolDataLocal } from '../config/types.config';

const { ObjectId } = Types

@Service()
export default class SchoolService {
    constructor(
        @Inject('models.Schools') private Schools: Model<Document>
    ) { }

    async findSchools(where: object = {}, options?: {
        sort?: object,
        skip?: number,
        limit?: number
    }) {
        const schools = await this.Schools
        .find(where)
        .sort(options?.sort)
        .skip(options?.skip || 0)
        .limit(options?.limit || 20)

        return schools;
    }
    

    async findSchoolsByCoordinates({ coordinates, maxDistance, limit, query, skip }: {
        coordinates: number[],
        maxDistance?: number | null,
        limit?: number | null,
        query?: MongooseFilterQuery<SchoolDataLocal> | null,
        skip?: number | null
    }): Promise<SchoolDataLocal[]> {
        const aggregateOptions: any[] = [];
        aggregateOptions.push({
            $geoNear: {
                near: { 
                    type: "Point", 
                    coordinates
                },
                distanceField: "distance.calculated",
                key: "location.geoJSON"
            }
        })

        if (query) {
            aggregateOptions[0].query = query;
        }

        aggregateOptions.push({ $skip: skip || 0 });

        aggregateOptions.push(limit ? { $limit: limit > 50 ? 50 : limit } : { $limit: 20 });

        const schools = await this.Schools.aggregate(aggregateOptions)
        
        return schools;
    }


    findSchool(where: object) {
        return this.Schools.findOne(where);
    }


    findOneById(id: Types.ObjectId) {
        return this.Schools.findById(id);
    }

    async addStudentMetadata({ studentId, schoolId }: {
        studentId: Types.ObjectId,
        schoolId: Types.ObjectId
    }) {
        await this.Schools.updateOne({ _id: schoolId }, {
            $push: { 'meta.students': studentId }
        })
    }

    async removeStudentMetadata({ studentId, schoolId }: {
        studentId: Types.ObjectId,
        schoolId: Types.ObjectId
    }) {
        await this.Schools.updateOne({_id: schoolId}, {
            $pull: { "meta.students": studentId }
        });
    }

    async addSchoolOfficialMetadata({ schoolOfficialId, schoolId }: {
        schoolOfficialId: Types.ObjectId,
        schoolId: Types.ObjectId
    }) {
        await this.Schools.updateOne({ _id: schoolId }, {
            $push: { 'meta.schoolOfficials': schoolOfficialId }
        })
    }

    async removeSchoolOfficialMetadata({ schoolOfficialId, schoolId }: {
        schoolOfficialId: Types.ObjectId,
        schoolId: Types.ObjectId
    }) {
        await this.Schools.updateOne({_id: schoolId}, {
            $pull: { "meta.schoolOfficials": schoolOfficialId }
        });
    }

    async addCourseMetadata({ courseId, schoolId }: {
        courseId: Types.ObjectId,
        schoolId: Types.ObjectId
    }) {
        await this.Schools.updateOne({ _id: schoolId }, {
            $push: { 'meta.courses': courseId }
        })
    }

    async removeCourseMetadata({ courseId, schoolId }: {
        courseId: Types.ObjectId,
        schoolId: Types.ObjectId
    }) {
        await this.Schools.updateOne({ _id: schoolId }, {
            $pull: { 'meta.courses': courseId }
        })
    }

    async refreshDatabase({ url } : { url?: string }) {
        return await refreshSchoolDatabase({ url });
    }
}

