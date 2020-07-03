import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";

// A subscriber is someone who signs up to the mailing list.

const subscriberSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: schemaValidators.email,
            message: (props) => `${props} is not a valid email`,
        },
        unique: true,
    },
});

const MailingListSubscriber = mongoose.model("subscriber", subscriberSchema);

export default MailingListSubscriber;
