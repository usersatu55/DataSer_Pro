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


    const {student_id , student_fname : first_name , student_lastname : last_name } = req

    try{


    }catch(err){

        return res.status(500).json({

            message:err.message

        })

    }


}