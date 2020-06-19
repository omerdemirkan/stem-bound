import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";

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
            default: "Hi! I'm a Stem-bound™ instructor.",
        },
        longDescription: {
            type: String,
            minlength: 4,
            maxlength: 2000,
        },
    },
    {
        timestamps: {
            createdAt: true,
        },
        discriminatorKey: "role",
    }
);

const Users = mongoose.model("user", userSchema);

export default Users;
