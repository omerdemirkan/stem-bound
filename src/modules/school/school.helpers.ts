

export function configureFindSchoolsQuery({
    lat, long, limit, skip, state
}: any) {
    let query = {};

    return {
        // geoJSON format
        coordinates: long && lat ? [+long, +lat] : null,
        limit: Math.floor(+limit) || null,
        skip: Math.floor(+skip) || null,
        query
    }
}