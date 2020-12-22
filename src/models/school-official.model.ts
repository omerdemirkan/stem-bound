import { Schema } from "mongoose";
import Users from "./user.model";
import { EUserRoles } from "../types";
import { schemaValidators } from "../helpers/model.helpers";

const schoolOfficialMetaSchema = new Schema(
    {
        school: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        chats: {
            type: [Schema.Types.ObjectId],
            required: true,
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all course ids added must be unique.",
            },
            index: true,
        },
    },
    {
        _id: false,
        timestamps: false,
    }
);

const SchoolOfficials = Users.discriminator(
    EUserRoles.SCHOOL_OFFICIAL,
    new Schema({
        position: {
            type: String,
            maxlength: 200,
            minlength: 2,
            required: true,
            trim: true,
        },
        meta: {
            type: schoolOfficialMetaSchema,
            required: true,
        },
    })
);

export default SchoolOfficials;
