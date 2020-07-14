import mongoose, { Schema } from "mongoose";
import { ILocationData } from "../types";

export const geoJsonSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point",
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    { _id: false }
);

export const locationSchema = new Schema(
    {
        zip: {
            type: String,
            required: true,
            unique: false,
            index: "text",
        },
        city: {
            type: String,
            required: true,
            index: "text",
        },
        state: {
            type: String,
            required: true,
        },
        geoJSON: {
            type: geoJsonSchema,
            index: "2dsphere",
        },
    },
    { _id: false, timestamps: false, versionKey: false }
);

const Locations = mongoose.model<ILocationData>("Location", locationSchema);

export default Locations;
