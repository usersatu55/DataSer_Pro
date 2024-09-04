const mongoose = require('mongoose');

const coursesSchema = new mongoose.Schema({

    course_code: { type: String, required: true },
    course_name: { type: String, required: true },
    instructor_fname: { type: String, required: true },
    instructor_lname: { type: String, required: true },
    email: { type: String, required: true },
    deletedAt: { type: Date } 
  }, { timestamps: true });
  
module.exports = mongoose.model('Course' , coursesSchema , 'courses');