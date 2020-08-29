import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";
import { IUser } from "../types";
import { locationSchema } from "./location.model";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: [true, "First name required"],
            trim: true,
            index: "text",
        },
        lastName: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: [true, "Last name required"],
            trim: true,
            index: "text",
        },
        email: {
            type: String,
            required: [true, "Email name required"],
            unique: [true, "Email already in use"],
            trim: true,
            validate: {
                validator: schemaValidators.email,
                message: (props) => `${props.value} is not a valid email`,
            },
        },
        hash: {
            type: String,
            maxlength: 200,
            minlength: 8,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 60,
            default: "Hi! I'm a Stem-bound™ user!",
        },
        longDescription: {
            type: String,
            maxlength: 2000,
        },
        profilePictureUrl: {
            type: String,
            required: false,
        },
        location: {
            type: locationSchema,
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

const Users = mongoose.model<IUser>("user", userSchema);

export default Users;
