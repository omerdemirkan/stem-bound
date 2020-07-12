import { Schema } from "mongoose";

const geoJsonSchema = new Schema({
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
});

const citySchema = new Schema(
    {
        zipCode: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        geoJSON: geoJsonSchema,
    },
    { _id: false, timestamps: false }
);
