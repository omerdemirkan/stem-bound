import { Model, Document, Types, MongooseFilterQuery } from "mongoose";
import { refreshSchoolDatabase } from "../jobs/school.jobs";
import { ISchool } from "../types";

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
        text,
    }: {
        coordinates: number[];
        limit?: number | null;
        query?: MongooseFilterQuery<ISchool> | null;
        skip?: number | null;
        text?: string;
    }): Promise<ISchool[]> {
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

        if (text) {
            aggregateOptions.push({ $text: { $search: text } });
        }

        aggregateOptions.push({ $skip: skip || 0 });

        aggregateOptions.push(
            limit ? { $limit: limit > 50 ? 50 : limit } : { $limit: 20 }
        );

        const schools = await this.Schools.aggregate(aggregateOptions);

        return schools;
    }

    async findSchoolsByText(text: string) {
        return await this.Schools.find({ $text: { $search: text } });
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
                $addToSet: { "meta.students": { $each: studentIds } },
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
                $addToSet: {
                    "meta.schoolOfficials": { $each: schoolOfficialIds },
                },
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
                $addToSet: { "meta.courses": { $each: courseIds } },
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
