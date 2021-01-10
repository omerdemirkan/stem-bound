import mongoose, { Schema } from "mongoose";
import { ILocationData } from "../types";

export const geoJsonSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["Point"],
            required: [true, "GeoJSON type required"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            required: [true, "GeoJSON coordinates required"],
        },
    },
    { _id: false, timestamps: false, versionKey: false }
);

export const locationSchema = new Schema(
    {
        zip: {
            type: String,
            required: [true, "Location zip required"],
            unique: false,
        },
        city: {
            type: String,
            required: [true, "Location city required"],
        },
        state: {
            type: String,
            required: [true, "Location state required"],
        },
        geoJSON: {
            type: geoJsonSchema,
            index: "2dsphere",
            required: [true, "Location geoJSON required"],
        },
    },
    { _id: false, timestamps: false, versionKey: false }
);

locationSchema.index({ zip: "text", city: "text" });

const Locations = mongoose.model<ILocationData>("Location", locationSchema);

export default Locations;
