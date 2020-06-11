

export function configureFindSchoolsQuery({
    lat, long, limit, skip, state
}: any) {
    let query: any = {};

    // configure query

    if (!Object.keys(query)) {
        query = null;
    }
    return {
        // geoJSON format
        coordinates: long && lat ? [+long, +lat] : null,
        limit: Math.floor(+limit) || null,
        skip: Math.floor(+skip) || null,
        query
    }
}