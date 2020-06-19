import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";

const metaSchema = new Schema(
    {
        school: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        courses: {
            type: [Schema.Types.ObjectId],
            required: true,
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all course ids added must be unique.",
            },
        },
    },
    {
        _id: false,
    }
);

const studentSchema = new Schema(
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
            trim: true,
        },
        interests: {
            type: [
                {
                    type: String,
                    minlength: [
                        2,
                        "At least 2 characters required for interests",
                    ],
                    maxlength: [
                        40,
                        "Maximum of 40 characters allowed for interests",
                    ],
                    trim: true,
                },
            ],
            validate: {
                validator: schemaValidators.arrayLength({ min: 1, max: 10 }),
                message: (props) => `1 to 10 interests required.`,
            },
        },
        shortDescription: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 60,
            default: "Hi! I'm a Stem-bound™ student.",
            trim: true,
        },
        longDescription: {
            type: String,
            minlength: 4,
            maxlength: 2000,
            trim: true,
        },
        meta: {
            type: metaSchema,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
        },
    }
);

const Students = mongoose.model("Student", studentSchema);

export default Students;
