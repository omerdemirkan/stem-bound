import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";

const metaSchema = new Schema(
    {
        users: {
            type: [Schema.Types.ObjectId],
            required: true,
            validate: {
                validator: schemaValidators.arrayLength({ min: 2, max: 10 }),
                message: (props) =>
                    `2 to 10 users required for a chat, ${props.value} is not a valid amount.`,
            },
        },
    },
    {
        _id: false,
        timestamps: false,
    }
);

const messageSchema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        text: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 2000,
        },
        readBy: {
            type: [Schema.Types.ObjectId],
            required: true,
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: (props) => `readBy must include unique object ids.`,
            },
        },
    },
    {
        // I want users to be able to alter messages by id.
        _id: true,
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    }
);

const chatSchema = new Schema(
    {
        messages: {
            type: [messageSchema],
            required: true,
            default: [],
        },
        meta: {
            type: metaSchema,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    }
);

const Chats = mongoose.model("chat", chatSchema);

export default Chats;
