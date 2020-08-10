import mongoose, { Schema, Types } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";
import { ECourseTypes, EMeetingTypes, ICourse } from "../types";

const courseMetaSchema = new Schema(
    {
        instructors: {
            type: [Schema.Types.ObjectId],
            required: [true, "Course instructor is required."],
            validate: {
                validator: schemaValidators.arrayLength({ min: 1, max: 5 }),
                message: "A course must have 1 to 5 instructors",
            },
        },
        students: {
            type: [Schema.Types.ObjectId],
            required: [true, "Course students are required."],
            default: [],
        },
        school: {
            type: Schema.Types.ObjectId,
            required: [true, "Course school is required."],
        },
    },
    {
        _id: false,
    }
);

const announcementMetaSchema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        readBy: {
            type: [Schema.Types.ObjectId],
            required: true,
            default: [],
        },
    },
    {
        _id: false,
    }
);

const announcementSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 2000,
        },
        meta: {
            type: announcementMetaSchema,
            required: true,
        },
    },
    {
        // I want instructors to be able to delete or update announcements by id
        _id: true,
        timestamps: {
            createdAt: true,
        },
    }
);

const meetingSchema = new Schema(
    {
        type: {
            type: String,
            enum: Object.values(EMeetingTypes),
            required: true,
        },
        roomNum: {
            type: String,
            minlength: 1,
            maxlength: 50,
            trim: true,
            required: [
                function () {
                    return this.type === EMeetingTypes.IN_PERSON;
                },
                "In person meetings require a room number",
            ],
        },
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
            required: true,
        },
        message: {
            type: String,
            minlength: 4,
            maxlength: 200,
        },
    },
    {
        _id: true,
    }
);

const courseSchema = new Schema({
    title: {
        type: String,
        minlength: 4,
        maxlength: 30,
        required: [true, "Course title is required."],
        trim: true,
    },
    shortDescription: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60,
        trim: true,
    },
    longDescription: {
        type: String,
        minlength: 4,
        maxlength: 2000,
        trim: true,
    },
    type: {
        type: String,
        enum: Object.values(ECourseTypes),
        required: [true, "Course type is required."],
    },
    meetings: {
        type: [meetingSchema],
        required: true,
        default: [],
    },
    announcements: {
        type: [announcementSchema],
        required: true,
        default: [],
    },
    meta: {
        type: courseMetaSchema,
        required: [true, "Course meta details are required."],
    },
});

const Courses = mongoose.model<ICourse>("Course", courseSchema);

export default Courses;
