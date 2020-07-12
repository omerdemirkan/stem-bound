import mongoose, { Schema } from "mongoose";

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

const locationSchema = new Schema(
    {
        zip: {
            type: Number,
            required: true,
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
    { _id: false, timestamps: false }
);

const Locations = mongoose.model("Location", locationSchema);

export default Locations;
