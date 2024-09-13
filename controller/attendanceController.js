const { get } = require('mongoose')
const  Attendance= require('../schema/attendanceSchema')
const Course = require('../schema/coursesSchema')   
const Enrollments = require('../schema/enrollmentsSchema')                        

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

    try{

        const deleteAttendance = await Attendance.findOneAndDelete({student_id} , {course_code})


        if(!deleteAttendance){

            return res.status(404).json({

                message: "Attendance not found"

            })

        }

        return res.status(200).json({

            "Attendance":deleteAttendance

        })


    }catch(err){

        return res.status(500).json({

            message : err.message
        })

    }

}

exports.openAttendance = async (req, res) => {
    const {course_code } = req.body;

    if (!course_code) {
        return res.status(400).json({
            message: "Bad request"
        });
    }

    try {
       
        const course = await Course.findOne({ course_code });

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        
        if (course.attendance_status === 'open') {
            return res.status(400).json({
                message: "Attendance is already open for this course"
            });
        }

      
        course.attendance_status = 'open';
        await course.save();

       
        setTimeout(async () => {
            course.attendance_status = 'closed';
            await course.save();
            console.log(`Attendance for course ${course_code} is now closed`);
        }, 60000);  

        return res.status(200).json({
            message: `Attendance for course ${course_code} is now open for 10 minutes`
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};


exports.checkInAttendance = async (req, res) => {
    
    const {course_code , student_id } = req.body;
    const {first_name:student_fname, last_name : studnet_lname, email} = req.user;

    if(!course_code || !student_id) { 

        return res.status(400).json({

            message : "Bad request",

        })

    }
   


    try {
        
        const course = await Course.findOne({ course_code });

        if (!course || course.attendance_status !== 'open') {
            return res.status(403).json({ message: "Attendance system is not open" });
        }

       
        const enrollment = await Enrollments.findOne({ course_code, student_id });
        
        if (!enrollment) {
            return res.status(404).json({ 
                
                message: "Student not enrolled in this course" 
            
            });
        }

        const attendance = new Attendance({
            course_code,
            student_id,
            student_fname,
            studnet_lname,
            email,
            status: 'present', 
            date: new Date(),
        });

        await attendance.save();

        return res.status(200).json({ 
            
            
            message: "Attendance checked in successfully" 
        
        
        });

    } catch (err) {
        
        return res.status(500).json({ 
            
            message: err.message 
        
        });
    }
};
