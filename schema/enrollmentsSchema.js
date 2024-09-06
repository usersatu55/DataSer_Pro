const mongoose = require('mongoose');

const enrollmentsSchema = new mongoose.Schema({
   
    student_id: { type: 'string', required: true},
    course_id: { type: 'string', required: true},
    deletedAt: { type: Date } 
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentsSchema);