const Student = require('../schema/studentSchema')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; 


exports.getStudent = async (req , res) => {

    try {
        const students = await Student.find()
        res.status(200).json(students)
    }catch(err) {
        res.status(500).json(err.message)
    }

}

exports.createStudent = async (req, res) => {
    const { student_id, first_name, last_name, email } = req.body;
  
    if (!student_id || !first_name || !last_name || !email) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }
  
    try {
      const newStudent = new Student({
        students: [
          {
            student_id, 
            first_name,
            last_name,
            email
          }
        ]
      });
  
      await newStudent.save();
  
      res.status(200).json(newStudent);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};