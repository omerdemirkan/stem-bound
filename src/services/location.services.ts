import { ILocationData, EModels } from "../types";
import { Model } from "mongoose";
import { model } from "../decorators";

export default class LocationService {
    @model(EModels.LOCATION)
    private Location: Model<ILocationData>;

    async findLocationsByText(
        text: string,
        options?: {
            sort?: object;
            skip?: number;
            limit?: number;
        }
    ): Promise<ILocationData[]> {
        return await this.Location.find({ $text: { $search: text } })
            .sort(options?.sort)
            .skip(options?.skip || 0)
            .limit(options?.limit ? Math.min(options?.limit, 20) : 20);
    }

    async findLocationByZip(zip: string) {
        return await this.Location.findOne({ zip });
    }
}
