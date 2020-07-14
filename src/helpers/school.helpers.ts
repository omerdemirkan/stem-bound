import { ISchoolQuery } from "../types";
import { getCoordinatesByIp } from "./location.helpers";

export function configureFindSchoolsQuery(
    requestQueries: any,
    ip: string
): ISchoolQuery {
    const {
        lat,
        long,
        limit,
        skip,
        with_school_officials,
        text,
        geo_ip,
    } = requestQueries;
    let query: any = { where: {} };

    if (with_school_officials) {
        query.where.meta = {
            schoolOfficials: { $not: { $size: 0 } },
        };
    }

    if (long && lat) {
        query.coordinates = [+long, +lat];
    } else if (geo_ip) {
        const { latitude, longitude } = getCoordinatesByIp(ip);
        query.coordinates = [longitude, latitude];
    }

    if (+limit) {
        query.limit = +limit;
    }

    if (+skip) {
        query.skip = +skip;
    }

    if (typeof text === "string") {
        query.text = text.toUpperCase();
    }

    return query;
}
