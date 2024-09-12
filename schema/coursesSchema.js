const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    day: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true }
}, { _id: false });

const coursesSchema = new mongoose.Schema({
    course_code: { type: String, required: true },
    course_name: { type: String, required: true },
    instructor_fname: { type: String, required: true },
    instructor_lname: { type: String, required: true },
    email: { type: String, required: true },
    course_time_slots: { type: [timeSlotSchema], required: true }, 
    attendance_status: { type: String, default: 'closed' }
}, { timestamps: true });

module.exports = mongoose.model('Course', coursesSchema, 'courses');


