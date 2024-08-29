const mongoose = require('mongoose');

const enrollmentsSchema = new mongoose.Schema({
    enrollments:
    [
        {
            student_id: { type: 'string', required: true},
            course_id: { type: 'string', required: true},
            enrollment_date:{type: 'date', required: true}
        }
    ]
})

module.exports = mongoose.model('Enrollment', enrollmentsSchema);