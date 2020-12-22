import { Model, Types } from "mongoose";
import { refreshSchoolDatabase } from "../jobs";
import { ISchool, EModels, IQuery, IFilterQuery } from "../types";
import { model } from "../decorators";

export default class SchoolService {
    @model(EModels.SCHOOL)
    private School: Model<ISchool>;

    async findSchools(
        query: IQuery<ISchool> = { filter: {} }
    ): Promise<ISchool[]> {
        const schools = await this.School.find(query.filter)
            .sort(query.sort)
            .skip(query.skip || 0)
            .limit(query.limit ? Math.min(query.limit, 20) : 20);

        return schools;
    }

    async findSchoolsByCoordinates(
        coordinates: number[],
        query: IQuery<ISchool> = { filter: {} }
    ): Promise<ISchool[]> {
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

        if (query.filter) geoNearOptions.$geoNear.query = query.filter;
        if (query.sort) aggregateOptions.push({ $sort: query.sort });
        if (query.skip) aggregateOptions.push({ $skip: query.skip });

        aggregateOptions.push({
            $limit: query.limit ? Math.min(query.limit, 50) : 20,
        });

        const schools = await this.School.aggregate(aggregateOptions);
        return schools;
    }

    async findSchoolsByText(
        text: string,
        query: IQuery<ISchool> = { filter: {} }
    ): Promise<ISchool[]> {
        query.filter.$text = { $search: text };
        return await this.findSchools(query);
    }

    async findSchool(filter: IFilterQuery<ISchool>): Promise<ISchool> {
        return await this.School.findOne(filter);
    }

    async findSchoolById(id: Types.ObjectId): Promise<ISchool> {
        return await this.School.findById(id);
    }

    async refreshDatabase(options: { url?: string }) {
        return await refreshSchoolDatabase(options);
    }
}
