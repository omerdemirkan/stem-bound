import { Schema } from "mongoose";
import Users from "./user.model";
import { EUserRoles } from "../types";
import { schemaValidators } from "../helpers/model.helpers";

const schoolOfficialMetaSchema = new Schema(
    {
        school: {
            type: Schema.Types.ObjectId,
            required: true,
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

const SchoolOfficials = Users.discriminator(
    EUserRoles.SCHOOL_OFFICIAL,
    new Schema({
        position: {
            type: String,
            maxlength: 200,
            minlength: 8,
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
