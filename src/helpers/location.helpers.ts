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
