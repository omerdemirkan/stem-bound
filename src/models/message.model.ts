import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers";
import { IMessage } from "../types";

const messageMetaSchema = new Schema(
    {
        chat: {
            type: Schema.Types.ObjectId,
            required: [true, "Message chat metadata required"],
            index: true,
        },
        from: {
            type: Schema.Types.ObjectId,
            required: [true, "Message from metadata required"],
            index: true,
        },
        readBy: {
            type: [Schema.Types.ObjectId],
            required: [true, "Message readBy metadata required"],
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: (props) => `readBy must include unique object ids.`,
            },
            index: true,
        },
    },
    { _id: false, timestamps: false, versionKey: false }
);

const messageSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 2000,
            index: "text",
        },
        meta: {
            type: messageMetaSchema,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isEdited: {
            type: Boolean,
            default: false,
        },
        pictureUrl: {
            type: String,
        },
    },
    {
        // I want users to be able to alter messages by id.
        _id: true,
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
        versionKey: false,
    }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
