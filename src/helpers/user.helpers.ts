import { EUserRoles, IUserQuery } from "../types";
import { errorService } from "../services";
import { EErrorTypes } from "../types/error.types";
import { getCoordinatesByIp } from "./location.helpers";

export function configureUsersQuery(
    requestQueries: any,
    ip: string
): Partial<IUserQuery> {
    const {
        role,
        limit,
        skip,
        sort_field,
        sort_direction,
        geo_ip,
    } = requestQueries;
    let query: Partial<IUserQuery> = {};

    if (isValidUserRole(role)) {
        query.role = role.toUpperCase();
    }

    if (sort_field && sort_direction && typeof +sort_direction === "number") {
        query.sort = { [sort_field]: +sort_direction };
    }

    if (+limit) {
        query.limit = +limit;
    }

    if (+skip) {
        query.skip = +skip;
    }

    if (geo_ip) {
        const { latitude, longitude } = getCoordinatesByIp(ip);
        query.coordinates = [longitude, latitude];
    }

    return query;
}

export function isValidUserRole(s: any) {
    return Object.values(EUserRoles).includes(s as EUserRoles);
}

export function toUserRole(s: any): EUserRoles {
    if (typeof s !== "string" || !isValidUserRole(s.toUpperCase()))
        errorService.throwError(EErrorTypes.BAD_REQUEST);

    return s.toUpperCase() as EUserRoles;
}
