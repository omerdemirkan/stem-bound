import { ILocationData } from "../types";
import { Model } from "mongoose";

export default class LocationService {
    constructor(private Locations: Model<ILocationData>) {}

    async findLocationsByText(
        text: string,
        options?: {
            sort?: object;
            skip?: number;
            limit?: number;
        }
    ): Promise<ILocationData[]> {
        return await this.Locations.find({ $text: { $search: text } })
            .sort(options?.sort)
            .skip(options?.skip || 0)
            .limit(options?.limit ? Math.min(options?.limit, 20) : 20);
    }

    async findLocationByZip(zip: string) {
        return await this.Locations.findOne({ zip });
    }
}
