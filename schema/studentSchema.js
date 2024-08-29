const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
  students: [
    {
      student_id: { type: String, required: true, unique: true }, 
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      email: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Student', studentSchema , 'students');
