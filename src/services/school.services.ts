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
        const schools = await this.Schools.find(where)
            .sort(options?.sort)
            .skip(options?.skip || 0)
            .limit(options?.limit || 20);

        return schools;
    }

    async findSchoolsByCoordinates({
        coordinates,
        maxDistance,
        limit,
        query,
        skip,
    }: {
        coordinates: number[];
        maxDistance?: number | null;
        limit?: number | null;
        query?: MongooseFilterQuery<ISchoolDataLocal> | null;
        skip?: number | null;
    }): Promise<ISchoolDataLocal[]> {
        const aggregateOptions: any[] = [];
        aggregateOptions.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates,
                },
                distanceField: "distance.calculated",
                key: "location.geoJSON",
            },
        });

        if (query) {
            aggregateOptions[0].query = query;
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
                $pull: { "meta.students": { $each: studentIds } },
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
                $pull: { "meta.schoolOfficials": { $each: schoolOfficialIds } },
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
                $pull: { "meta.courses": { $each: courseIds } },
            }
        );
    }

    async refreshDatabase({ url }: { url?: string }) {
        return await refreshSchoolDatabase({ url });
    }
}
