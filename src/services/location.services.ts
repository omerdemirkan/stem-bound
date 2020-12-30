import { ILocationData, IQuery, ILocationService } from "../types";
import { injectable } from "inversify";
import { Location } from "../models";

@injectable()
class LocationService implements ILocationService {
    private model = Location;

    async findLocations(
        query: IQuery<ILocationData>
    ): Promise<ILocationData[]> {
        return await this.model
            .find(query.filter)
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
        return await this.model.findOne({ zip });
    }
}

export default LocationService;
