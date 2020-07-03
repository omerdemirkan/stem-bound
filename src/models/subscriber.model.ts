import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";

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

const Subscribers = mongoose.model("subscriber", subscriberSchema);

export default Subscribers;
