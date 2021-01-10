import { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";
import Users from "./user.model";
import { EUserRoles } from "../types";

const studentMetaSchema = new Schema(
    {
        school: {
            type: Schema.Types.ObjectId,
            required: [true, "School Metadata Required"],
        },
        courses: {
            type: [Schema.Types.ObjectId],
            required: [true, "Course Metadata Required"],
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all course ids added must be unique.",
            },
        },
        chats: {
            type: [Schema.Types.ObjectId],
            required: [true, "Chat Metadata Required"],
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all course ids added must be unique.",
            },
        },
    },
    { _id: false, timestamps: false, versionKey: false }
);

const Students = Users.discriminator(
    EUserRoles.STUDENT,
    new Schema({
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
        meta: {
            type: studentMetaSchema,
            required: true,
            default: {},
        },
    })
);

export default Students;
