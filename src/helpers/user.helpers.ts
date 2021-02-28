import {
    EUserRoles,
    EErrorTypes,
    IUser,
    IQuery,
    IRequestMetadata,
    ICoordinates,
} from "../types";
import { errorService } from "../services";
import { getCoordinatesByIp } from "./location.helpers";
import { Types } from "mongoose";

const { ObjectId } = Types;

export function configureUserArrayQuery(
    requestMetadata: IRequestMetadata
): { query: IQuery<IUser>; coordinates } {
    let {
        role,
        limit,
        skip,
        geo_ip,
        lat,
        long,
        exclude,
        user_ids,
        text,
        chat_id,
        course_id,
        school_id,
    } = requestMetadata.query;

    role = isValidUserRole(role) ? role.toUpperCase() : null;
    limit = +limit;
    skip = +skip;
    lat = +lat;
    long = +long;
    exclude = exclude ? exclude.split(",").map((id) => ObjectId(id)) : null;
    user_ids = user_ids ? user_ids.split(",").map((id) => ObjectId(id)) : null;
    chat_id = ObjectId.isValid(chat_id) ? ObjectId(chat_id) : null;
    course_id = ObjectId.isValid(course_id) ? ObjectId(course_id) : null;

    let query: IQuery<IUser> = { filter: {} };
    let coordinates: ICoordinates;

    if (role) query.filter.role = role;
    if (user_ids || exclude) query.filter._id = {};
    if (user_ids) query.filter._id.$in = user_ids;
    if (exclude) query.filter._id.$nin = exclude;
    if (text) query.filter.$text = { $search: text };
    if (limit) query.limit = limit;
    if (skip) query.skip = skip;
    if (chat_id) query.filter["meta.chats"] = chat_id;
    if (course_id) query.filter["meta.courses"] = course_id;
    if (school_id) query.filter["meta.school"] = school_id;

    if (+lat && +long) {
        coordinates = [+long, +lat];
    } else if (geo_ip) {
        const { latitude, longitude } = getCoordinatesByIp(requestMetadata.ip);
        coordinates = [longitude, latitude];
    }

    return { query, coordinates };
}

export function configureUserArrayResponseData(
    users: IUser[],
    requestMetadata: IRequestMetadata
): IUser[] {
    return users;
}

export function configureUserResponseData(
    user: IUser,
    requestMetadata: IRequestMetadata
): IUser {
    return user;
}

export function isValidUserRole(s: any) {
    return Object.values(EUserRoles).includes(s as EUserRoles);
}

export function toUserRole(s: any): EUserRoles {
    if (typeof s !== "string" || !isValidUserRole(s.toUpperCase()))
        errorService.throwError(EErrorTypes.BAD_REQUEST, "Invalid user role");

    return s.toUpperCase() as EUserRoles;
}
