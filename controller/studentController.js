const Student = require('../schema/studentSchema')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

exports.getStudent = async (req , res) => {

    try {
        const students = await Student.find()
        res.status(200).json(students)
    }catch(err) {
        res.status(500).json(err.message)
    }

}

exports.createStudent = async (req, res) => {
  
  const { student_id, first_name, last_name, email, password  , department} = req.body;

  if (!student_id || !first_name || !last_name || !email || !password || !department) {
      return res.status(400).json({
          message: 'Bad request',
      });
  }

  try {
      const checkstudent = await Student.findOne({ student_id: student_id });

      if (checkstudent) {
          return res.status(401).json({
              message: 'Student ID already exists',
          });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newstudent = new Student({
          student_id,
          first_name,
          last_name,
          email,
          password: hashedPassword,
          department,
          deletedAt:null
        
      });

      const savestudent = await newstudent.save();

      return res.status(200).json({
          message: "Create Student successfully",
          student: savestudent
      });

  } catch (err) {
      
      return res.status(500).json({
          message: err.message
      });
  }
};


exports.deleteStudent = async (req, res) => {

    const {student_id} = req.query

    if(!student_id){
      
      return res.status(400).json({
        message:"Bad request",
      })

    }

    try{

      const delstudent = await Student.findOneAndDelete({student_id: student_id})

      if(!delstudent){
        return res.status(404).json({
          message:"Student not found"
        })
      }
      return res.status(200).json({

        message:"Delete Student Succesfuly"

      })


    }catch(err){
      res.status(500).json({
        message:err.message
      })
    }

}


exports.updateStudent = async (req, res) => {
  const { student_id } = req.query; 
  const { first_name, last_name, email, password, new_student_id } = req.body; 

  if (!student_id) {
    return res.status(400).json({
      message: "Bad Request"
    });
  }

  const updatestudent = {};

 
  if (first_name && first_name.trim() !== "") updatestudent.first_name = first_name;
  if (last_name && last_name.trim() !== "") updatestudent.last_name = last_name;
  if (email && email.trim() !== "") updatestudent.email = email;
  if (new_student_id && new_student_id.trim() !== "") updatestudent.student_id = new_student_id; 
  
  
  if (password && password.trim() !== "") {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updatestudent.password = hashedPassword; 
  }

  try {
    const newstudent = await Student.findOneAndUpdate(
      { student_id },  
      updatestudent,   
      { new: true, runValidators: true }  
    );

    if (!newstudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: "Student updated successfully",
      student: newstudent
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};



exports.createAraayStudents = async (req, res) => {
  
  const students = req.body;

    
    if (!students || !Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ 
          
          message: "Bad Request" 
        
        });
    }

    try {
        const studentsToInsert = [];

        for (const student of students) {
            const { student_id, first_name, last_name, email, password , department } = student;

            
            if (!student_id || !first_name || !last_name || !email || !password ,  !department) {
                return res.status(400).json({ 
                  
                  message: "All fields are required for each student" 
                
                });
            }

          
            const existingStudent = await Student.findOne({ $or: [{ email }, { student_id }] });
            if (existingStudent) {
                return res.status(400).json({ 
                  
                  message: `Student with email ${email} or ID ${student_id} already exists` 
                
                });
            }

          
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            studentsToInsert.push({
                student_id,
                first_name,
                last_name,
                email,
                password: hashedPassword,
                department
            });
        }

        const insertedStudents = await Student.insertMany(studentsToInsert);

        res.status(201).json({ 
          message: "Students created successfully", 
          students: insertedStudents 
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
