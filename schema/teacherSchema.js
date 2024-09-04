const mongoose = require('mongoose');


const teacherSchema = new mongoose.Schema({
  
      teacher_id: { type: String, required: true, unique: true }, 
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      email: { type: String, required: true },
      password:{ type: String, required: true},
      department: { type: String, required: true},
      deletedAt: { type: Date } 
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema , 'teachers');