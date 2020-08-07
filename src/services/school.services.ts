import { Model, Types, MongooseFilterQuery } from "mongoose";
import { refreshSchoolDatabase } from "../jobs";
import { ISchool, EModels } from "../types";
import { model } from "../decorators";

export default class SchoolService {
    @model(EModels.SCHOOL)
    private School: Model<ISchool>;

    async findSchools(
        where: object = {},
        options?: {
            sort?: object;
            skip?: number;
            limit?: number;
        }
    ): Promise<ISchool[]> {
        const schools = await this.School.find(where || {})
            .sort(options?.sort)
            .skip(options?.skip || 0)
            .limit(options?.limit ? Math.min(options?.limit, 20) : 20);

        return schools;
    }

    async findSchoolsByCoordinates({
        coordinates,
        limit,
        where,
        skip,
        text,
    }: {
        coordinates: number[];
        limit?: number | null;
        where?: MongooseFilterQuery<ISchool> | null;
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

        if (where && Object.keys(where).length) {
            geoNearOptions.$geoNear.query = where;
        }

        if (text) {
            aggregateOptions.push({ $text: { $search: text } });
        }

        aggregateOptions.push({ $skip: skip || 0 });

        aggregateOptions.push(
            limit ? { $limit: limit > 50 ? 50 : limit } : { $limit: 20 }
        );

        const schools = await this.School.aggregate(aggregateOptions);

        return schools;
    }

    async findSchoolsByText(text: string): Promise<ISchool[]> {
        return await this.School.find({ $text: { $search: text } });
    }

    async findSchool(where: object): Promise<ISchool> {
        return await this.School.findOne(where);
    }

    async findSchoolById(id: Types.ObjectId): Promise<ISchool> {
        return await this.School.findById(id);
    }

    async addStudentMetadata({
        studentIds,
        schoolIds,
    }: {
        studentIds: Types.ObjectId[];
        schoolIds: Types.ObjectId[];
    }): Promise<void> {
        await this.School.updateMany(
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
    }): Promise<void> {
        await this.School.updateMany(
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
    }): Promise<void> {
        await this.School.updateMany(
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
    }): Promise<void> {
        await this.School.updateMany(
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
    }): Promise<void> {
        await this.School.updateMany(
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
    }): Promise<void> {
        await this.School.updateMany(
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
