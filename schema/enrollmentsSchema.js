const mongoose = require('mongoose');

const enrollmentsSchema = new mongoose.Schema({
   
    
    course_code: { 
        type: 'string', 
        required: true
    },
    student_id: { 
        type: 'string', 
        required: true
    },
    student_fname:{ 
        type: 'string', 
        required: true
    },
    student_lname:{ 
        type: 'string', 
        required: true
    },
    student_email:{ 
        type: 'string', 
        required: true
    },
    deletedAt: { 
        type: Date 
    } 
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentsSchema , 'enrollments');