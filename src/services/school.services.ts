import { Model, Document, Types, MongooseFilterQuery } from "mongoose";
import { refreshSchoolDatabase } from "../jobs/school.jobs";
import { ISchoolDataLocal } from "../types";

const { ObjectId } = Types;

export default class SchoolService {
    constructor(private Schools: Model<Document>) {}

    async findSchools(
        where: object = {},
        options?: {
            sort?: object;
            skip?: number;
            limit?: number;
        }
    ) {
        console.log(where);
        const schools = await this.Schools.find(where || {})
            .sort(options?.sort)
            .skip(options?.skip || 0)
            .limit(options?.limit ? Math.min(options?.limit, 20) : 20);

        return schools;
    }

    async findSchoolsByCoordinates({
        coordinates,
        limit,
        query,
        skip,
    }: {
        coordinates: number[];
        limit?: number | null;
        query?: MongooseFilterQuery<ISchoolDataLocal> | null;
        skip?: number | null;
    }): Promise<ISchoolDataLocal[]> {
        const geoNearOptions: any = {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates,
                },
                distanceField: "distance.calculated",
                key: "location.geoJSON",
            },
        };
        const aggregateOptions: any[] = [geoNearOptions];

        if (query && Object.keys(query).length) {
            geoNearOptions.$geoNear.query = query;
        }

        aggregateOptions.push({ $skip: skip || 0 });

        aggregateOptions.push(
            limit ? { $limit: limit > 50 ? 50 : limit } : { $limit: 20 }
        );

        const schools = await this.Schools.aggregate(aggregateOptions);

        return schools;
    }

    findSchool(where: object) {
        return this.Schools.findOne(where);
    }

    findSchoolById(id: Types.ObjectId) {
        return this.Schools.findById(id);
    }

    async addStudentMetadata({
        studentIds,
        schoolIds,
    }: {
        studentIds: Types.ObjectId[];
        schoolIds: Types.ObjectId[];
    }) {
        await this.Schools.updateMany(
            { _id: { $in: schoolIds } },
            {
                $push: { "meta.students": { $each: studentIds } },
            }
        );
    }

    async removeStudentMetadata({
        studentIds,
        schoolIds,
    }: {
        studentIds: Types.ObjectId[];
        schoolIds: Types.ObjectId[];
    }) {
        await this.Schools.updateMany(
            { _id: { $in: schoolIds } },
            {
                $pullAll: { "meta.students": studentIds },
            }
        );
    }

    async addSchoolOfficialMetadata({
        schoolOfficialIds,
        schoolIds,
    }: {
        schoolOfficialIds: Types.ObjectId[];
        schoolIds: Types.ObjectId[];
    }) {
        await this.Schools.updateMany(
            { _id: { $in: schoolIds } },
            {
                $push: { "meta.schoolOfficials": { $each: schoolOfficialIds } },
            }
        );
    }

    async removeSchoolOfficialMetadata({
        schoolOfficialIds,
        schoolIds,
    }: {
        schoolOfficialIds: Types.ObjectId[];
        schoolIds: Types.ObjectId[];
    }) {
        await this.Schools.updateMany(
            { _id: { $in: schoolIds } },
            {
                $pullAll: { "meta.schoolOfficials": schoolOfficialIds },
            }
        );
    }

    async addCourseMetadata({
        courseIds,
        schoolIds,
    }: {
        courseIds: Types.ObjectId[];
        schoolIds: Types.ObjectId[];
    }) {
        await this.Schools.updateMany(
            { _id: { $in: schoolIds } },
            {
                $push: { "meta.courses": { $each: courseIds } },
            }
        );
    }

    async removeCourseMetadata({
        courseIds,
        schoolIds,
    }: {
        courseIds: Types.ObjectId[];
        schoolIds: Types.ObjectId[];
    }) {
        await this.Schools.updateMany(
            { _id: { $in: schoolIds } },
            {
                $pullAll: { "meta.courses": courseIds },
            }
        );
    }

    async refreshDatabase({ url }: { url?: string }) {
        return await refreshSchoolDatabase({ url });
    }
}
