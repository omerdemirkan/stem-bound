import mongoose from 'mongoose';

const geoJsonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true
    }
})

const locationSchema = new mongoose.Schema({
    country: {
        type: String,
        default: "USA"
    },
    state: {
        type: String,
        required: [true, "School state required"]
    },
    city: {
        type: String,
        required: [true, "School city required"]
    },
    zip: {
        type: String,
        required: [true, "School zip code required"]
    },
    county: {
        type: String
    },
    latitude: {
        type: Number,
        required: [true, "School latitude required"],
    },
    longitude: {
        type: Number,
        required: [true, "School longitude required"]
    },
    geoJSON: {
        type: geoJsonSchema,
        required: true
    }
}, {
    _id: false
});

const demographicsSchema = new mongoose.Schema({
    enrollment: {
        type: Number
    },
    numTeachers: {
        type: Number
    },
    url: {
        type: String
    }
}, {
    _id: false
});

const contactSchema = new mongoose.Schema({
    telephone: {
        type: String
    },
    website: {
        type: String
    }
}, {
    _id: false
})

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "School name required."],
        minlength: 2,
        maxlength: 100
    },
    ncesid: {
        type: String,
        required: [true, "School ncesid required"],
        unique: true
    },
    districtId: {
        type: String
    },
    startGrade: {
        type: Number
    },
    endGrade: {
        type: Number,
        validate: {
            validator: (endGrade: number) => (endGrade === 12)
        }
    },
    type: {
        type: Number,
        required: [true, "School type required"]
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8],
        required: [true, "School status required"]
    },
    location: {
        type: locationSchema,
        required: true
    },
    demographics: {
        type: demographicsSchema,
        required: true
    },
    contact: {
        type: contactSchema,
        require: true
    }
}, {
    versionKey: false
});

locationSchema.index({
    geoJSON: '2d'
});

const School = mongoose.model('School', schoolSchema);

export default School;