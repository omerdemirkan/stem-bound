import { Schema } from "mongoose";
import { schemaValidators } from "../helpers/model.helpers";
import Users from "./user.model";
import { EUserRoles } from "../types";

const studentMetaSchema = new Schema(
    {
        school: {
            type: String,
            required: [true, "School Metadata Required"],
        },
        courses: {
            type: [Schema.Types.ObjectId],
            required: [true, "Course Metadata Required"],
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all course ids added must be unique.",
            },
        },
        chats: {
            type: [Schema.Types.ObjectId],
            required: [true, "Chat Metadata Required"],
            default: [],
            validate: {
                validator: schemaValidators.uniqueStringArray,
                message: "all course ids added must be unique.",
            },
        },
    },
    { _id: false, timestamps: false, versionKey: false }
);

const Students = Users.discriminator(
    EUserRoles.STUDENT,
    new Schema({
        interests: {
            type: [
                {
                    type: String,
                    minlength: [
                        2,
                        "At least 2 characters required for interests",
                    ],
                    maxlength: [
                        40,
                        "Maximum of 40 characters allowed for interests",
                    ],
                    trim: true,
                },
            ],
            required: true,
            minlength: 1,
            maxlength: 10,
        },
        initialGradeLevel: {
            type: Number,
            require: true,
            validate: {
                validator(gradeLevel: number) {
                    return (
                        Math.floor(gradeLevel) === gradeLevel &&
                        gradeLevel >= 6 &&
                        gradeLevel <= 12
                    );
                },
                message:
                    "Student grade level must be between 6 and 12 inclusive",
            },
        },
        initialSchoolYear: {
            type: String,
            required: true,
            validate: {
                validator(initialSchoolYear) {
                    const [startYear, endYear] = initialSchoolYear
                        .split("-")
                        .map((str) => +str) as number[];
                    const currentYear = new Date().getFullYear();
                    return (
                        !isNaN(startYear) &&
                        !isNaN(endYear) &&
                        endYear - startYear === 1 &&
                        (endYear === currentYear || endYear === currentYear + 1)
                    );
                },
            },
            default() {
                const now = new Date(),
                    currentMonth = now.getMonth();
                let startYear = now.getFullYear();
                if (currentMonth <= 6) startYear -= 1;
                return `${startYear}-${startYear + 1}`;
            },
        },
        meta: {
            type: studentMetaSchema,
            required: true,
            default: {},
        },
    })
);

export default Students;
