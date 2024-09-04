const  Teacher  = require('../schema/teacherSchema')
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
    const {teacher_id} = req.query
    const { first_name, last_name, email, password, department } = req.body;

    if(!teacher_id){
        return res.status(400).json({
            message:"Bad request"
        })
    }



    const updateTeacher = {}

    if(first_name) updateTeacher.first_name = first_name
    if(last_name) updateTeacher.last_name = last_name
    if(email) updateTeacher.email = email
    if(password) updateTeacher.password = password
    if(department) updateTeacher.department = department

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
    const teachers = req.body

    if(!teachers || !Array.isArray(teachers) || teachers.length === 0){

        return res.status(401).json({
            message:"Bad request"
        })

    }

    try{

        const teachertoinsert = []

        for(const teacher of teachers){

            const {teacher_id , first_name , last_name , email ,password ,  department} = teacher

            if( !teacher_id || !first_name || !last_name || !email || !password || department ){

                return res.status(400).json({
                    message: "Bad request"
                })

            }


            const checkteacher = Teacher.findOne({$or : [{teacher_id} , {email}]})

            if(checkteacher){

                return res.status(400).json({
                    message:`Student with email ${email} or ID ${student_id} already exists`
                })
                 

            }

            const salt = await bcrypt.genSalt(10)
            const hashpassword = await bcrypt.hashPassword(password , salt) 




            teachertoinsert.push({
                teacher_id,
                first_name,
                last_name,
                email,
                password:hashpassword,
                department
            })

            const saveteacher = await teachertoinsert.save()

            return res.status(200).json({
                message:"Create Teacher Suceesfuly",
                "Teacher":saveteacher
            })


        }

    }catch(err){


        return res.status(500).json({
            message:err.message
        })


    }
}