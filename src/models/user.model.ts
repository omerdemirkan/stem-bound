import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";
import { IUser } from "../types";
import { geoJsonSchema } from "./location.model";

const userLocationSchema = new Schema(
    {
        zip: {
            type: String,
            required: [true, "Location zip required"],
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

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: [true, "First name required"],
            trim: true,
        },
        lastName: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: [true, "Last name required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email required"],
            unique: [true, "Email already in use"],
            trim: true,
            index: true,
            validate: {
                validator: schemaValidators.email,
                message: (props) => `${props.value} is not a valid email`,
            },
        },
        hash: {
            type: String,
            maxlength: 200,
            minlength: 8,
            required: [true, "Hash required"],
        },
        shortDescription: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 60,
            trim: true,
            default: "Hi! I'm a Stem-bound™ user!",
        },
        longDescription: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        profilePictureUrl: {
            type: String,
            trim: true,
            required: false,
        },
        location: {
            type: userLocationSchema,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
        },
        discriminatorKey: "role",
    }
);

userSchema.index({
    firstName: "text",
    lastName: "text",
    shortDescription: "text",
    email: "text",
});

const Users = mongoose.model<IUser>("user", userSchema);

export default Users;
