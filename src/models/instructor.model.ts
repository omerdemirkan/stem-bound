import { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";
import Users from "./user.model";
import { EUserRoles } from "../types";

const instructorMetaSchema = new Schema(
    {
        courses: {
            type: [Schema.Types.ObjectId],
            required: true,
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all course ids added must be unique.",
            },
        },
        chats: {
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

const Instructors = Users.discriminator(
    EUserRoles.INSTRUCTOR,
    new Schema({
        specialties: {
            type: [
                {
                    type: String,
                    minlength: [
                        2,
                        "At least 2 characters required for specialties",
                    ],
                    maxlength: [
                        40,
                        "Maximum of 40 characters allowed for specialties",
                    ],
                },
            ],
            validate: {
                validator: schemaValidators.arrayLength({ min: 1, max: 10 }),
                message: (props) => `1 to 10 specialties required.`,
            },
        },
        meta: {
            type: instructorMetaSchema,
            required: true,
            default: {},
        },
    })
);

export default Instructors;
