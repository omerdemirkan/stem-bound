import { EUserRoles } from "../types";

export function configureUsersQuery(
    requestQueries: any
): {
    limit?: number;
    skip?: number;
    sort?: object;
    role?: EUserRoles;
    where?: object;
} {
    const { role, limit, skip, sort_field, sort_direction } = requestQueries;
    let query: {
        limit?: number;
        skip?: number;
        sort?: object;
        role?: EUserRoles;
        where?: object;
    } = {};

    if (isValidUserRole(role)) {
        query.role = role.toUpperCase();
    }

    if (sort_field && sort_direction && typeof +sort_direction === "number") {
        query.sort = { [sort_field]: +sort_direction };
    }

    if (+limit) {
        query.limit = +limit;
    }

    if (skip) {
        query.skip = +skip;
    }

    return query;
}

export function isValidUserRole(s: any) {
    return Object.values(EUserRoles).includes(s as EUserRoles);
}

export function toUserRole(s: any): EUserRoles {
    if (typeof s !== "string" || !isValidUserRole(s.toUpperCase()))
        throw new Error("Invalid user role");

    return s.toUpperCase() as EUserRoles;
}
