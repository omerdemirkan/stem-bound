import mongoose, { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";
import { ISchool } from "../types";

const geoJsonSchema = new Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});

const locationSchema = new Schema(
    {
        country: {
            type: String,
            default: "USA",
        },
        state: {
            type: String,
            required: [true, "School state required"],
        },
        city: {
            type: String,
            required: [true, "School city required"],
        },
        zip: {
            type: String,
            required: [true, "School zip code required"],
        },
        county: {
            type: String,
        },
        latitude: {
            type: Number,
            required: [true, "School latitude required"],
        },
        longitude: {
            type: Number,
            required: [true, "School longitude required"],
        },
        geoJSON: {
            type: geoJsonSchema,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const demographicsSchema = new Schema(
    {
        enrollment: {
            type: Number,
        },
        numTeachers: {
            type: Number,
        },
        url: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const contactSchema = new Schema(
    {
        telephone: {
            type: String,
        },
        website: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const metaSchema = new Schema(
    {
        schoolOfficials: {
            type: [Schema.Types.ObjectId],
            required: true,
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all schoolOfficial ids added must be unique.",
            },
        },
        students: {
            type: [Schema.Types.ObjectId],
            required: true,
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all student ids added must be unique.",
            },
        },
        courses: {
            type: [Schema.Types.ObjectId],
            required: true,
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all courses ids added must be unique.",
            },
        },
    },
    {
        _id: false,
    }
);

const schoolSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "School name required."],
            minlength: 2,
            maxlength: 100,
        },
        ncesid: {
            type: String,
            required: [true, "School ncesid required"],
            unique: true,
        },
        districtId: {
            type: String,
        },
        startGrade: {
            type: Number,
        },
        endGrade: {
            type: Number,
            validate: {
                validator: (endGrade: number) => endGrade === 12,
            },
        },
        type: {
            type: Number,
            required: [true, "School type required"],
        },
        status: {
            type: Number,
            enum: [1, 2, 3, 4, 5, 6, 7, 8],
            required: [true, "School status required"],
        },
        location: {
            type: locationSchema,
            required: true,
        },
        demographics: {
            type: demographicsSchema,
            required: true,
        },
        contact: {
            type: contactSchema,
            require: true,
        },
        meta: {
            type: metaSchema,
            required: true,
            default: {},
        },
    },
    {
        versionKey: false,
    }
);

locationSchema.index({
    geoJSON: "2dsphere",
});

// schoolSchema.index({ name: "text" });

const Schools = mongoose.model<ISchool>("School", schoolSchema);

export default Schools;
