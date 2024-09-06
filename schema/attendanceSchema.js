const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  
        
        enrollment_id:{type: 'string' , required: true},
        date :{type:'date',required: true},
        status: {type:'string' , required: true}
        
    
});

module.exports = mongoose.model('Attendance' , attendanceSchema)