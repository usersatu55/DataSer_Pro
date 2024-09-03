const  Teacher  = require('../schema/teacherSchema')
const mongoose = require('mongoose');



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
            message:err.message
        });
    }

    try{

        const checkteacher = await Teacher.findOne({teacher_id: teacher_id})

        if(checkteacher){
            return res.status(401).json({
                message: "Teacher already exists"
            })
        }
        
        
        const newteacher = new Teacher({
        
                
                    teacher_id,
                    first_name,
                    last_name,
                    email,
                    password,
                    department
                
            
        })

        savestudent = await newteacher.save()
        
        return res.status(200).json(savestudent)
    
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
            return res.status(404).json({
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