const  Teacher  = require('../schema/teacherSchema')
const Student = require('../schema/studentSchema')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


exports.getTeacher = async (req , res) => {

    try {
        const students = await Teacher.find()
        res.status(200).json(students)
    }catch(err) {
        res.status(500).json(err.message)
    }

}

exports.createTeacher = async (req , res) =>{

    const {teacher_id , first_name , last_name , email ,password ,  department} = req.body;


    if( !teacher_id || !first_name || !last_name || !email || !password || !department){
        return res.status(400).json({
            message: "Bad Request",
        });
    }

    try{

        const checkteacher = await Teacher.findOne({teacher_id: teacher_id})

        if(checkteacher){
            return res.status(401).json({
                message: "Teacher already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newteacher = new Teacher({
        
                
                    teacher_id,
                    first_name,
                    last_name,
                    email,
                    password:hashedPassword,
                    department,
                    deletedAt:null
                
            
        })

        savestudent = await newteacher.save()
        
        return res.status(200).json({
            message:"Create Teacher SuccesFuly",
            "Teacher":savestudent
        })
    
    }catch(err){
        return res.status(500).json({
            message: err.message
        });
    }

}

exports.deleteTeacher = async (req, res) => {
    const {teacher_id} = req.query


    if(!teacher_id){
        return res.status(404).json({
            message: "Teacher not found"
        })
    }


    try {

        const delteacher = await Teacher.findOneAndDelete({teacher_id: teacher_id})

        if(!delteacher){
            return res.status(400).json({
                message: "Teacher not found"
            })
        }

        return res.status(200).json({
            message:"Delete Teacher Succesfuly"
        })
        
    }catch(err){

        return res.status(500).json({
            message: err.message
        })


    }
}

exports.updateTeacher = async (req , res) =>{
    const {teacher_id} = req.user;
    const {first_name, last_name, email, password, department } = req.body;

    if(!teacher_id){
        return res.status(400).json({
            message:"Bad request"
        })
    }



    const updateTeacher = {}

    if(first_name && first_name.trim() !== "") updateTeacher.first_name = first_name
    if(last_name && last_name.trim() !== "") updateTeacher.last_name = last_name
    if(email && email.trim() !== "") updateTeacher.email = email
    if(password && password.trim() !== ""){

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateTeacher.password = hashedPassword; 


    }
    if(department && department.trim() !== "") updateTeacher.department = department

    try{

        const Teacherupdate = await Teacher.findOneAndUpdate(
            {teacher_id},
            updateTeacher,

            {new:true , runValidators:true}
        ) 

        if(!Teacherupdate){

            return res.status(404).json({
                message:"Teacher Not Found"
            })

        }


        return res.status(200).json({
            message:"Update Succesfuly",
            "Teacher":Teacherupdate
        })

        

    }catch(err){

        return res.status(500).json({
            message:err.message
        })

    }
}




exports.createArrayTeacher = async (req, res) => {
    const teachers = req.body;

    
    if (!teachers || !Array.isArray(teachers) || teachers.length === 0) {
        return res.status(401).json({
            message: "Bad request",
        });
    }

    try {
        const teachersToInsert = [];

        for (const teacher of teachers) {
            const { teacher_id, first_name, last_name, email, password, department } = teacher;

            
            if (!teacher_id || !first_name || !last_name || !email || !password || !department) {
                return res.status(400).json({
                    message: "Bad request",
                });
            }

            
            const checkTeacher = await Teacher.findOne({ $or: [{ teacher_id }, { email }] });

            if (checkTeacher) {
                return res.status(400).json({
                    message: `Teacher with email ${email} or ID ${teacher_id} already exists`,
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            teachersToInsert.push({
                teacher_id,
                first_name,
                last_name,
                email,
                password: hashedPassword,
                department,
                deletedAt: null, 
            });
        }

      
        const savedTeachers = await Teacher.insertMany(teachersToInsert);

        return res.status(200).json({
            message: "Teachers created successfully",
            teachers: savedTeachers,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};


exports.teacherUpdateStudent = async (req, res) => {

    const {student_id} = req.query;
    const {first_name, last_name, email, password, new_student_id, department } = req.body;
  
    if (!student_id) {
      return res.status(400).json({ message: "Bad Request: student_id is required" });
    }
  
    const updateFields = {};
  
    
    if (first_name && first_name.trim() !== "") updateFields.first_name = first_name;
    if (last_name && last_name.trim() !== "") updateFields.last_name = last_name;
    if (email && email.trim() !== "") updateFields.email = email;
    if (department && department.trim() !== "") updateFields.department = department;
    if (new_student_id && new_student_id.trim() !== "") updateFields.student_id = new_student_id;
  
    
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }
  
    try {
      
      const updatedStudent = await Student.findOneAndUpdate(
        {student_id}, 
        updateFields,  
        { new: true, runValidators: true } 
      );
  
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
  
     
      return res.status(200).json({
        message: "Student updated successfully",
        student: updatedStudent
      });
  
    } catch (err) {
      
      return res.status(500).json({ message: err.message });
    }
  };
