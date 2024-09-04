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
    const { student_id, first_name, last_name, email , password } = req.body;
  
    if (!student_id || !first_name || !last_name || !email || !password) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }
  
    try {

      const checkstudent = await Student.findOne({student_id: student_id});

      if(checkstudent){
        return res.status(401).json({
          message:"Student already exists",
        })
      }

      const newStudent = new Student({
       
            student_id, 
            first_name,
            last_name,
            email,
            password
         
      });
  
      await newStudent.save();
  
      res.status(200).json(newStudent);
    } catch (err) {
      res.status(500).json({ message: err.message });
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


exports.updateStudent = async (req , res) =>{


  const {student_id} = req.query
  const  {first_name , last_name ,email , password} = req.body



}
