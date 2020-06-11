import { Service, Inject, Container } from 'typedi';
import { Model, Document, Types, MongooseFilterQuery } from 'mongoose';
import { refreshSchoolDatabase } from '../../jobs/school.jobs';
import { SchoolDataLocal } from '../../config/types.config';

@Service()
export default class SchoolService {
    constructor(
        @Inject('models.School') private School: Model<Document>
    ) {}

    async findSchools(where: object = {}, options?: {
        sort?: object,
        skip?: number,
        limit?: number
    }) {
        const schools = await this.School
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

        if (skip) {
            aggregateOptions.push({ $skip: skip });
        }

        if (limit) {
            aggregateOptions.push({ $limit: limit > 50 ? 50 : limit });
        }
        const schools = await this.School.aggregate(aggregateOptions)
        
        return schools;
    }


    findSchool(where: object) {
        return this.School.findOne(where);
    }


    findOneById(id: Types.ObjectId) {
        return this.School.findById(id);
    }

    async refreshDatabase({ url } : { url?: string }) {
        return await refreshSchoolDatabase({ url });
    }
}