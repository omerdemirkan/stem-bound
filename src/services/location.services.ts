import { ILocationData, EModels, IQuery, ILocationService } from "../types";
import { Model } from "mongoose";
import { model } from "../decorators";
import { injectable } from "inversify";

@injectable()
class LocationService implements ILocationService {
    @model(EModels.LOCATION)
    private Location: Model<ILocationData>;

    async findLocations(
        query: IQuery<ILocationData>
    ): Promise<ILocationData[]> {
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
        return await this.findLocations(query);
    }

    async findLocationByZip(zip: string) {
        return await this.Location.findOne({ zip });
    }
}

export default LocationService;
