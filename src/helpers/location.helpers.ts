import geoIp from "geoip-lite";
import { ILocationDataOriginal, ILocationData } from "../types";

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
    let locationsHashTable = {};
    let i = data.length;
    let key: string;
    while (i--) {
        key = data[i].fields.state + data[i].fields.city;
        if (
            !locationsHashTable[key] ||
            new Date(data[i].record_timestamp) >
                new Date(locationsHashTable[key].record_timestamp)
        ) {
            locationsHashTable[key] = data[i];
        }
    }
    return Object.values(locationsHashTable);
}

export function mapAndFilterLocationData(data: ILocationDataOriginal[]) {
    return mapLocationData(filterLocationData(data));
}

export function getCoordinatesByIp(
    ip: string
): { latitude: number; longitude: number } {
    try {
        const {
            ll: [latitude, longitude],
        } = geoIp.lookup(ip);
        return { latitude, longitude };
    } catch (e) {
        // If an error occurs, this is likely cause by localhost ip during development.
        return { latitude: 34.0522, longitude: -118.2437 };
    }
}
