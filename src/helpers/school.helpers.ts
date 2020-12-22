import { ICoordinates, IQuery, ISchool } from "../types";
import { getCoordinatesByIp } from "./location.helpers";

export function configureFindSchoolsQuery(
    requestQueries: any,
    ip: string
): { query: IQuery<ISchool>; coordinates: ICoordinates } {
    let {
        lat,
        long,
        limit,
        skip,
        with_school_officials,
        text,
        geo_ip,
    } = requestQueries;
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
        const { latitude, longitude } = getCoordinatesByIp(ip);
        coordinates = [longitude, latitude];
    }

    if (limit) query.limit = limit;

    if (skip) query.skip = skip;

    if (typeof text === "string") query.filter.$text = { $search: text };

    return { query, coordinates };
}
