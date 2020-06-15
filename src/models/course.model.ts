import mongoose, { Schema, Types } from 'mongoose';
import { courseTypes, classTypes } from '../config/constants.config';
import { schemaValidators } from '../helpers/model.helpers';

// const durationSchema = new Schema({
//     start: {
//         type: Date,
//         required: [true, "Course start date is required."]
//     },
//     end: {
//         type: Date,
//         required: [true, "Course end date is required."]
//     }
// }, {
//     _id: false
// });

const metaSchema = new Schema({
    instructors: {
        type: [Schema.Types.ObjectId],
        required: [true, "Course instructor is required."],
        validate: {
            validator: schemaValidators.arrayLength({ min: 1, max: 5 }),
            message: 'A course must have 1 to 5 instructors'
        }
    },
    students: {
        type: [Schema.Types.ObjectId],
        required: [true, "Course students are required."],
        default: []
    }
}, {
    _id: false
});

const classSchema = new Schema({
    type: {
        type: String,
        enum: classTypes,
        required: true
    },
    roomNum: {
        type: String,
        minlength: 1,
        maxlength: 50,
        trim: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        minlength: 4,
        maxlength: 200
    }
}, {
    _id: false
});

const scheduleSchema = new Schema({
    classes: {
        type: [classSchema],
        required: true,
        default: [],
        validate: {
            validator: schemaValidators.arrayLength({ min: 0, max: 200 }),
            message: 'A maximum of 200 classes allowed'
        }
    }
}, {
    _id: false
});

const courseSchema = new Schema({
    topic: {
        type: String,
        minlength: 4,
        maxlength: 30,
        required: [true, "Course topic is required."],
        trim: true
    },
    shortDescription: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60,
        trim: true
    },
    longDescription: {
        type: String,
        minlength: 4,
        maxlength: 2000,
        trim: true
    },
    type: {
        type: String,
        enum: courseTypes,
        required: [true, "Course type is required."]
    },
    // duration: {
    //     type: durationSchema,
    //     required: [true, "Course duration is required."]
    // },
    meta: {
        type: metaSchema,
        required: [true, "Course meta details are required."]
    },
    schedule: {
        type: scheduleSchema,
        required: true,
        default: {}
    }
});

const Courses = mongoose.model('Course', courseSchema);

export default Courses;