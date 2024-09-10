const { get } = require('mongoose')
const  Attendance= require('../schema/attendanceSchema')

exports.getAttendance = async (req , res) => {


    try{

        const getattendance = await Attendance.find()

        if(!getattendance){

            return res.status(404).json({

                message: 'Attendance not found'
            
            })

            
        }
        return res.status(200).json({

            Attendance : getattendance

        })



    }catch(err){
        
        return res.status(500).json({

            message: err.message

        })

    }

}

exports.getAttendanceBy = async(req , res) => {


    const {student_id} = req.user

    try{

        const getattendance = await Attendance.find({student_id})

        if(!getattendance){

            return res.status(404).json({

                message : 'Attendance not found'

            })

            
        }
        return res.status(200).json({

            Attendance: getattendance

        })


    }catch(err){

        return res.status(500).json({

            message: err.message

        })

    }


}

exports.createAttendance = async (req , res) =>{

    const {course_code} = req.query
    const {student_id , first_name :student_fname  , last_name: student_lname , email} = req.user

    if(!course_code){

        return res.status(400).json({

            message : "Bad request"

        }) 

    }

    try{

        const saveAttendance = new Attendance(
            {
                course_code,
                student_id,
                student_fname,
                student_lname,
                email,
                deletedAt:null
            }
        )

        const attendanceSave = await saveAttendance.save()

        return res.status(200).json({

            message : "Create Attendance Succesfuly",
            "Attendance" : attendanceSave 

        })


    }catch(err){

        return res.status(500).json({

            message:err.message

        })

    }


}

exports.deleteAttendance = async(req , res) =>{

    const {student_id , course_code} = req.query

    if(!student_id || !course_code){

        return res.status(400).json({

            message : "Bad request"

        })

    }

}

