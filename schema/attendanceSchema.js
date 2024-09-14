const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  
        
        course_code:{type: 'string' , required: true},
        student_id:{type: 'string' , required: true},
        student_fname:{type: 'string', required : true},
        student_lname:{type: 'string', required : true},
        email:{type: 'string', required : true},
        status: {type:'string' , required: true},
        date: { type: Date } 
});
module.exports = mongoose.model('Attendance' , attendanceSchema , 'attendances')