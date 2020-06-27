export function configureFindSchoolsQuery({
    lat,
    long,
    limit,
    skip,
    with_school_officials,
}: any) {
    let query: any = {};

    if (with_school_officials) {
        query.meta = {
            schoolOfficials: { $not: { $size: 0 } },
        };
    }

    // configure query

    if (!Object.keys(query)) {
        query = null;
    }
    return {
        // geoJSON format
        coordinates: long && lat ? [+long, +lat] : null,
        limit: Math.floor(+limit) || null,
        skip: Math.floor(+skip) || null,
        query,
    };
}
