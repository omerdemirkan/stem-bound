import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers";
import { EChatTypes, IChat } from "../types";

const chatMetaSchema = new Schema(
    {
        users: {
            type: [Schema.Types.ObjectId],
            required: [true, "User metadata required"],
            validate: {
                validator: schemaValidators.arrayLength({ min: 2, max: 10 }),
                message: (props) =>
                    `2 to 10 users required for a chat, ${props.value} is not a valid amount.`,
            },
            index: true,
        },
    },
    {
        _id: false,
        timestamps: false,
    }
);

const chatSchema = new Schema(
    {
        type: {
            type: String,
            enum: Object.keys(EChatTypes),
            required: [true, "Chat type required"],
        },
        meta: {
            type: chatMetaSchema,
            required: [true, "Chat metadata required"],
        },
        name: {
            type: String,
            trim: true,
        },
        pictureUrl: {
            type: String,
            trim: true,
        },
        lastMessageSentAt: {
            type: Date,
        },
        privateChatKey: {
            type: String,
            index: true,
            unique: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

const Chats = mongoose.model<IChat>("chat", chatSchema);

export default Chats;
