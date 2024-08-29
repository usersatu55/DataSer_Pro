const mongoose = require('mongoose');


const coursesSchema = new mongoose.Schema({
  
    courses:[
    {
        course_code:{type: 'string', required: true},
        course_name:{type: 'string', required: true},
        instructor:{type: 'string', required: true}
    }
  ]
});


module.exports = mongoose.model('Course' , coursesSchema , 'courses');