import { Types } from "mongoose";
import { refreshSchoolDatabase } from "../jobs";
import { ISchool, IQuery, IFilterQuery, ISchoolService } from "../types";
import { injectable } from "inversify";
import { School } from "../models";

@injectable()
class SchoolService implements ISchoolService {
    private model = School;

    async findSchools(
        query: IQuery<ISchool> = { filter: {} }
    ): Promise<ISchool[]> {
        const schools = await this.model
            .find(query.filter)
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

        const schools = await this.model.aggregate(aggregateOptions);
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
        return await this.model.findOne(filter);
    }

    async findSchoolByNcesId(ncesid: string): Promise<ISchool> {
        return await this.findSchool({ ncesid });
    }

    async refreshDatabase(options: { url?: string }) {
        return await refreshSchoolDatabase(options);
    }
}

export default SchoolService;
