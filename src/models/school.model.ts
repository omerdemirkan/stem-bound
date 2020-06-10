import mongoose from 'mongoose';

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
    }
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
});

const contactSchema = new mongoose.Schema({
    telephone: {
        type: String
    },
    website: {
        type: String
    }
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
});

const School = mongoose.model('School', schoolSchema);

export default School;