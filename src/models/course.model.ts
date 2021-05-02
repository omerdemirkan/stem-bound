import mongoose, { Schema, Types } from "mongoose";
import {
    courseEndValidator,
    courseVerificationHistoryValidator,
    courseMeetingsValidator,
} from "../helpers";
import { schemaValidators } from "../helpers/model.helpers";
import {
    ECourseTypes,
    EMeetingTypes,
    ICourse,
    ECourseVerificationStatus,
} from "../types";

const courseMetaSchema = new Schema(
    {
        instructors: {
            type: [Schema.Types.ObjectId],
            required: [true, "Course instructor is required."],
            validate: {
                validator: schemaValidators.combineValidators(
                    schemaValidators.uniqueIdArray,
                    schemaValidators.arrayLength({ min: 1, max: 5 })
                ),
                message: "Courses must have 1 to 5 unique instructors",
            },
            index: true,
        },
        students: {
            type: [Schema.Types.ObjectId],
            required: [true, "Course students are required."],
            default: [],
            validate: {
                validator: schemaValidators.combineValidators(
                    schemaValidators.uniqueIdArray,
                    schemaValidators.arrayLength({ min: 0, max: 100 })
                ),
                message: "Course students must be unique",
            },
            index: true,
        },
        school: {
            type: String,
            required: [true, "Course school is required."],
            index: true,
        },
    },
    { _id: false, timestamps: false, versionKey: false }
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
    { _id: false, timestamps: false, versionKey: false }
);

const announcementSchema = new Schema(
    {
        text: {
            type: String,
            required: [true, "Announcement text field required"],
            minlength: 10,
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
        versionKey: false,
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
            maxlength: 100,
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
                validator: schemaValidators.combineValidators(
                    schemaValidators.url
                ),
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
        versionKey: false,
        timestamps: false,
    }
);

const courseVerificationStatusUpdateMetaSchema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        _id: false,
        timestamps: false,
        versionKey: false,
    }
);

const courseVerificationStatusUpdateSchema = new Schema(
    {
        meta: courseVerificationStatusUpdateMetaSchema,
        status: {
            type: String,
            enum: Object.keys(ECourseVerificationStatus),
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        _id: false,
        timestamps: false,
        versionKey: false,
    }
);

const courseResourceSchema = new Schema({
    url: {
        type: String,
        required: true,
        validate: [schemaValidators.url, "Course resources require a url"],
        maxlength: 1000,
    },
    label: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    description: {
        type: String,
        minlength: 2,
        maxlength: 1000,
    },
});

const courseSchema = new Schema(
    {
        title: {
            type: String,
            minlength: 4,
            maxlength: 50,
            required: [true, "Course title is required."],
            trim: true,
        },
        verificationStatus: {
            type: String,
            enum: Object.keys(ECourseVerificationStatus),
            required: true,
            default: ECourseVerificationStatus.UNPUBLISHED,
        },
        verificationHistory: {
            type: [courseVerificationStatusUpdateSchema],
            validate: {
                validator: courseVerificationHistoryValidator,
                message:
                    "course verification updates must change update course verification statuses",
            },
            required: true,
            default: [],
        },
        shortDescription: {
            type: String,
            required: [true, "Course short description is required."],
            minlength: 4,
            maxlength: 100,
            trim: true,
        },
        longDescription: {
            type: String,
            minlength: 4,
            maxlength: 2000,
            trim: true,
        },
        start: {
            type: Date,
            required: [true, "Course start date required"],
        },
        end: {
            type: Date,
            required: [true, "Course start date required"],
            validate: {
                validator: courseEndValidator,
                message: "Course end date is invalid",
            },
        },
        type: {
            type: String,
            enum: Object.values(ECourseTypes),
            required: [true, "Course type is required."],
        },
        remoteSyllabusUrl: {
            type: String,
            validate: [schemaValidators.url, "Boojie doojie"],
        },
        meetings: {
            type: [meetingSchema],
            required: true,
            default: [],
            validate: {
                validator: courseMeetingsValidator,
                message: "Meeting time conflict found!",
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
        resources: {
            type: [courseResourceSchema],
            required: [true, "Course resources required"],
            default: [],
        },
    },
    {
        timestamps: false,
        versionKey: false,
    }
);

courseSchema.index({
    title: "text",
    shortDescription: "text",
});

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
