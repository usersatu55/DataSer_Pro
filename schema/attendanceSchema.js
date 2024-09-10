const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  
        
        course_code:{type: 'string' , required: true},
        student_id:{type: 'string' , required: true},
        student_fname:{type: 'string', required : true},
        studnet_lname:{type: 'string', required : true},
        date :{type:'date',required: true},
        status: {type:'string' , required: true},
        deletedAt: { type: Date } 
}, { timestamps: true });
module.exports = mongoose.model('Attendance' , attendanceSchema , 'attendances')