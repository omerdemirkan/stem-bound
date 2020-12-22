import { ILocationData, EModels, IQuery } from "../types";
import { Model } from "mongoose";
import { model } from "../decorators";

export default class LocationService {
    @model(EModels.LOCATION)
    private Location: Model<ILocationData>;

    async findLocation(query: IQuery<ILocationData>): Promise<ILocationData[]> {
        return await this.Location.find(query.filter)
            .sort(query.sort)
            .skip(query.skip || 0)
            .limit(query.limit ? Math.min(query.limit, 20) : 20);
    }

    async findLocationsByText(
        text: string,
        query: IQuery<ILocationData> = { filter: {} }
    ): Promise<ILocationData[]> {
        query.filter.$text = { $search: text };
        return await this.findLocation(query);
    }

    async findLocationByZip(zip: string) {
        return await this.Location.findOne({ zip });
    }
}
