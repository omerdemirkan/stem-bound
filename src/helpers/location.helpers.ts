import { ILocationDataOriginal, ILocationData } from "../types/location.types";

export function configureLocationQuery(query: { text }) {
    return { text: query.text };
}

export function mapLocationData(
    data: ILocationDataOriginal[]
): Partial<ILocationData>[] {
    return data.map((location: ILocationDataOriginal) => ({
        zip: location.fields.zip,
        city: location.fields.city,
        state: location.fields.state,
        geoJSON: {
            type: "Point",
            coordinates: [location.fields.longitude, location.fields.latitude],
        },
    }));
}

export function filterLocationData(
    data: ILocationDataOriginal[]
): ILocationDataOriginal[] {
    let locationsHashMap = {};
    let i = data.length;
    let key: string;
    while (i--) {
        key = data[i].fields.state + data[i].fields.city;
        if (
            !locationsHashMap[key] ||
            new Date(data[i].record_timestamp) >
                new Date(locationsHashMap[key].record_timestamp)
        ) {
            locationsHashMap[key] = data[i];
        }
    }
    return Object.values(locationsHashMap);
}

export function mapAndFilterLocationData(data: ILocationDataOriginal[]) {
    return mapLocationData(filterLocationData(data));
}
