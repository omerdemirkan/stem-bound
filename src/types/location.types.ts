export interface ILocationDataOriginal {
    datasetid: string;
    recordid: string;
    fields: {
        city: string;
        zip: string;
        dst: number;
        geopoint: any[];
        longitude: number;
        state: string;
        latitude: number;
        timezone: number;
    };
    geometry: { type: "Point"; coordinates: any[] };
    record_timestamp: Date;
}

export interface ILocationData {
    zip: string;
    city: string;
    state: string;
    geoJSON: {
        type: "Point";
        coordinates: number[];
    };
}
