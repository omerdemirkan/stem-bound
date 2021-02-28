import { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";
import Users from "./user.model";
import { EUserRoles } from "../types";

const instructorMetaSchema = new Schema(
    {
        courses: {
            type: [Schema.Types.ObjectId],
            required: [true, "Course metadata required"],
            default: [],
            maxlength: 100,
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "Instructors must have 0 to 10 unique courses.",
            },
            index: true,
        },
        chats: {
            type: [Schema.Types.ObjectId],
            required: [false, "Chat metadata required"],
            default: [],
            maxlength: 100,
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all course ids added must be unique.",
            },
            index: true,
        },
    },
    { _id: false, timestamps: false, versionKey: false }
);

const Instructors = Users.discriminator(
    EUserRoles.INSTRUCTOR,
    new Schema({
        specialties: {
            type: [String],
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
