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

    let query: ISubDocumentQuery<T> = {
        filter(elem) {
            return (
                (!before || new Date(elem[timeKey]) < before) &&
                (!after || new Date(elem[timeKey]) > after)
            );
        },
    };

    if (limit) query.limit = limit;
    if (skip) query.skip = skip;
    return query;
}
