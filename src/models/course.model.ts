import mongoose, { Schema, Types } from 'mongoose';
import { courseTypes } from '../config/constants.config';

const durationSchema = new Schema({
    start: {
        type: Date,
        required: [true, "Course start date is required."]
    },
    end: {
        type: Date,
        required: [true, "Course end date is required."]
    }
}, {
    _id: false
});

const metaSchema = new Schema({
    instructor: {
        type: Schema.Types.ObjectId,
        required: [true, "Course instructor is required."]
    },
    students: {
        type: [Schema.Types.ObjectId],
        required: [true, "Course students are required."],
        default: []
    }
}, {
    _id: false
});

const courseSchema = new Schema({
    topic: {
        type: String,
        minlength: 4,
        maxlength: 30,
        required: [true, "Course topic is required."]
    },
    shortDescription: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60
    },
    longDescription: {
        type: String,
        minlength: 4,
        maxlength: 2000
    },
    type: {
        type: String,
        enum: courseTypes,
        required: [true, "Course type is required."]
    },
    instructorName: {
        type: String,
        required: [true, "Course instructor name is required."]
    },
    duration: {
        type: durationSchema,
        required: [true, "Course duration is required."]
    },
    meta: {
        type: metaSchema,
        required: [true, "Course meta details are required."]
    }
});

const Course = mongoose.model('Course', courseSchema)