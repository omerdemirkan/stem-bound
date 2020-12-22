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
        with_school_officials,
        text,
        geo_ip,
    } = requestMetadata.query;
    lat = +lat;
    long = +long;
    limit = +limit;
    skip = +skip;
    with_school_officials = !!with_school_officials;

    let query: IQuery<ISchool> = { filter: {} },
        coordinates: ICoordinates;

    if (with_school_officials) {
        query.filter.meta = {
            // @ts-ignore
            schoolOfficials: { $not: { $size: 0 } },
        };
    }

    if (long && lat) {
        coordinates = [+long, +lat];
    } else if (geo_ip) {
        const { latitude, longitude } = getCoordinatesByIp(requestMetadata.ip);
        coordinates = [longitude, latitude];
    }

    if (limit) query.limit = limit;

    if (skip) query.skip = skip;

    if (typeof text === "string") query.filter.$text = { $search: text };

    return { query, coordinates };
}
