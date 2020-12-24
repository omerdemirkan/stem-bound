import { IRequestMetadata, ISubDocumentQuery } from "../types";

export function configureSubdocumentQuery<T>(
    requestMetadata: IRequestMetadata,
    options?: { timeKey: string }
): ISubDocumentQuery<T> {
    const timeKey = options?.timeKey || "createdAt";
    let { before, after, limit, skip } = requestMetadata.query;

    before = before ? new Date(before) : null;
    after = after ? new Date(after) : null;
    limit = +limit;
    skip = +skip;

    let query: ISubDocumentQuery<T> = {};
    if ((before || after) && !query.filter) query.filter = () => true;

    if (before)
        query.filter = (element) =>
            query.filter(element) &&
            new Date(element[timeKey]).getTime() < before?.getTime();

    if (before)
        query.filter = (element) =>
            query.filter(element) &&
            new Date(element[timeKey]).getTime() > after?.getTime();

    if (limit) query.limit = limit;
    if (skip) query.skip = skip;
    return query;
}
