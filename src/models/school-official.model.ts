import mongoose, { Schema } from 'mongoose';
import { schemaValidators } from '../helpers/model.helpers';

const metaSchema = new Schema({
    school: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    _id: false
});

const schoolOfficialSchema = new Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: [true, 'First name required'],
        trim: true
    },
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: [true, 'Last name required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email name required'],
        unique: [true, "Email already in use"],
        trim: true,
        validate: {
            validator: schemaValidators.email,
            message: props => `${props.value} is not a valid email`
        }
    },
    hash: {
        type: String,
        maxlength: 200,
        minlength: 8,
        required: true,
        trim: true
    },
    shortDescription: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60,
        default: "Hi! I'm a Stem-bound™ school official.",
        trim: true
    },
    longDescription: {
        type: String,
        minlength: 4,
        maxlength: 2000,
        trim: true
    },
    position: {
        type: String,
        maxlength: 200,
        minlength: 8,
        required: true,
        trim: true
    },
    meta: {
        type: metaSchema,
        required: true
    }
}, {
    timestamps: {
        createdAt: true
    }
});

const SchoolOfficials = mongoose.model('SchoolOfficial', schoolOfficialSchema);

export default SchoolOfficials;