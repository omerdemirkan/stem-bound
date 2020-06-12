import mongoose, { Schema } from 'mongoose';

const studentSchema = new Schema({

});

const Students = mongoose.model('Student', studentSchema);

export default Students;