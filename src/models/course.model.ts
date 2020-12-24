import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";
import { ECourseTypes, EMeetingTypes, ICourse, IMeeting } from "../types";

const courseMetaSchema = new Schema(
    {
        instructors: {
            type: [Schema.Types.ObjectId],
            required: [true, "Course instructor is required."],
            validate: {
                validator: schemaValidators.uniqueIdArray,
                message: "Course instructors must be unique",
            },
            minlength: 1,
            maxlength: 5,
            index: true,
        },
        students: {
            type: [Schema.Types.ObjectId],
            required: [true, "Course students are required."],
            default: [],
            validate: {
                validator: schemaValidators.uniqueIdArray,
                message: "Course students must be unique",
            },
            minlength: 0,
            maxlength: 100,
            index: true,
        },
        school: {
            type: Schema.Types.ObjectId,
            required: [true, "Course school is required."],
            index: true,
        },
    },
    {
        _id: false,
        timestamps: false,
    }
);

const announcementMetaSchema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            required: [true, "Announcement from field required"],
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
            required: [true, "Announcement text field required"],
            minlength: 4,
            maxlength: 2000,
        },
        meta: {
            type: announcementMetaSchema,
            required: true,
            default: {},
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
            required: [true, "Meeting type field required"],
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
        url: {
            type: String,
            validate: {
                validator: schemaValidators.combineValidators([
                    schemaValidators.url,
                ]),
                message: "Invalid url for meeting type",
            },
            required: [
                function () {
                    return this.type === EMeetingTypes.REMOTE;
                },
                "Remote meetings require meetings urls",
            ],
        },
        start: {
            type: Date,
            required: [true, "Meeting start field required"],
        },
        end: {
            type: Date,
            required: [true, "Meeting end field required"],
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
        maxlength: 40,
        required: [true, "Course title is required."],
        trim: true,
    },
    verified: {
        type: Boolean,
        required: [true, "Course verification field is required."],
        default: false,
    },
    shortDescription: {
        type: String,
        required: [true, "Course short description is required."],
        minlength: 4,
        maxlength: 80,
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
        validate: {
            validator: schemaValidators.uniqueKeyMapping(function (
                meeting: IMeeting
            ) {
                const date = new Date(meeting.start);
                date.setHours(0, 0, 0, 0);
                return date.toString();
            }),
            message:
                "Meeting dates for a course must be unique, cannot have two meetings on the same day!",
        },
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

courseSchema.index({
    title: "text",
    shortDescription: "text",
});

const Courses = mongoose.model<ICourse>("Course", courseSchema);

export default Courses;
