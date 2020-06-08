import mongoose, {Schema, Model} from 'mongoose';

const instructorSchema: Schema = new Schema({
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
        unique: true,
        trim: true,
        validate: {
            validator: function (firstName: string) {
                return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(firstName);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    specialties: {
        type: [
            {
                type: String,
                unique: true,
                minlength: [2, 'At least 2 characters required for specialties'],
                maxlength: [40, 'Maximum of 40 characters allowed for specialties']
            }
        ],
        required: [true, 'Specialties required'],
        minlength: [1, 'At least one specialty required'],
        maxlength: [10, 'Maximum of 10 specialties allowed']
    }
});

const Instructor = mongoose.model('Instructor', instructorSchema);

export default Instructor;