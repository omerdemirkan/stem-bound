import { Service, Inject, Container } from 'typedi';
import { Model, Document, Types, MongooseFilterQuery } from 'mongoose';
import { refreshSchoolDatabase } from '../../jobs/school.jobs';

@Service()
export default class SchoolService {
    constructor(
        @Inject('models.School') private School: Model<Document>
    ) {}

    async findSchools(where: object = {}, options?: {
        sort: object,
        skip: number,
        limit: number
    }) {
        const schools = this.School
        .find(where)
        .sort(options?.sort)
        .skip(options?.skip || 0)
        .limit(options?.limit || 20)

        return schools;
    }

    async findSchoolsByCoordinates({ coordinates, maxDistance, limit }: {
        coordinates: number[],
        maxDistance?: number,
        limit?: number,
        query?: MongooseFilterQuery<{_id: Types.ObjectId}>
    }) {
        const schools = await this.School.aggregate([
            {
                $geoNear: {
                    near: { 
                        type: "Point", 
                        coordinates 
                    },
                    distanceField: "distance.calculated",
                    key: "location.geoJSON"
                }
            },
            { $limit: 5 }
        ])
        
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