import { fetch, logger } from "../config";
import { mapAndFilterLocationData } from "../helpers";
import { Location } from "../models";

const defaultUrl =
    "https://public.opendatasoft.com/explore/dataset/us-zip-code-latitude-and-longitude/download/?format=json&timezone=America/Los_Angeles&lang=en";

export async function refreshLocationDatabase(options?: { url?: string }) {
    logger.info("Beginning location database population");
    const fetchedLocationData = (await fetch.get(options?.url || defaultUrl))
        .data;

    const locations = mapAndFilterLocationData(fetchedLocationData);

    const numLocations = locations.length;
    const numDBLocations = await Location.countDocuments();

    if (numLocations === numDBLocations) {
        throw new Error(
            "Fetched location data seems to be the same as in the database"
        );
    }

    const deletionData = await Location.deleteMany({});
    const insertionData = await Location.insertMany(locations);
    logger.info("Location db refreshed");

    return {
        results: {
            deletionData,
            insertionData: {
                numInserted: insertionData.length,
            },
        },
    };
}
