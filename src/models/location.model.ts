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
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        geoJSON: geoJsonSchema,
    },
    { _id: false, timestamps: false, versionKey: false }
);

locationSchema.index({ zip: "text", city: "text" }, { unique: false });

const Locations = mongoose.model<ILocationData>("Location", locationSchema);

export default Locations;