import { fetch, logger } from "../config";
import { ILocationDataOriginal } from "../types";
import { mapAndFilterLocationData } from "../helpers";
import { Locations } from "../models";

const defaultUrl =
    "https://public.opendatasoft.com/explore/dataset/us-zip-code-latitude-and-longitude/download/?format=json&timezone=America/Los_Angeles&lang=en";

export async function refreshLocationDatabase(options?: { url?: string }) {
    logger.info("fetch locations starting");
    const fetchedLocationData = (await fetch.get(options?.url || defaultUrl))
        .data;

    const locations = mapAndFilterLocationData(fetchedLocationData);

    const numLocations = locations.length;
    const numDBLocations = await Locations.countDocuments();

    if (numLocations === numDBLocations) {
        throw new Error(
            "Fetched location data seems to be the same as in the database"
        );
    }

    const deletionData = await Locations.deleteMany({});
    const insertionData = await Locations.insertMany(locations);
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
