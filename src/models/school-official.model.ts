import { Schema } from "mongoose";
import Users from "./user.model";
import { EUserRoles } from "../types";

const schoolOfficialMetaSchema = new Schema(
    {
        school: {
            type: Schema.Types.ObjectId,
            required: true,
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
