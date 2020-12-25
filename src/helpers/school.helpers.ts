import { ICoordinates, IQuery, IRequestMetadata, ISchool } from "../types";
import { getCoordinatesByIp } from "./location.helpers";

export function configureSchoolArrayQuery(
    requestMetadata: IRequestMetadata
): { query: IQuery<ISchool>; coordinates: ICoordinates } {
    let {
        lat,
        long,
        limit,
        skip,
        text,
        geo_ip,
        filter,
    } = requestMetadata.query;
    lat = +lat;
    long = +long;
    limit = +limit;
    skip = +skip;

    let query: IQuery<ISchool> = { filter: {} },
        coordinates: ICoordinates;

    try {
        query.filter = JSON.parse(filter);
    } catch (e) {}

    if (long && lat) {
        coordinates = [+long, +lat];
    } else if (geo_ip) {
        const { latitude, longitude } = getCoordinatesByIp(requestMetadata.ip);
        coordinates = [longitude, latitude];
    }

    if (limit) query.limit = limit;

    if (skip) query.skip = skip;

    if (text) query.filter.$text = { $search: text };

    return { query, coordinates };
}
