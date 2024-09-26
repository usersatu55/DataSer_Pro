const { get } = require('mongoose')
const  Attendance= require('../schema/attendanceSchema')
const Course = require('../schema/coursesSchema')   
const Enrollments = require('../schema/enrollmentsSchema')                        

exports.getAttendance = async (req, res) => {
    try {
        const getattendance = await Attendance.find();

        if (!getattendance) {
            return res.status(404).json({
                message: 'Attendance not found'
            });
        }

        
        const formattedAttendance = getattendance.map(att => {
            return {
                ...att._doc,
                date: new Date(att.date).toLocaleString('th-TH', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            };
        });

        return res.status(200).json({
            Attendance: formattedAttendance
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}


exports.getAttendanceBy = async (req, res) => {
    const { course_code, status, day, month, year } = req.query; 
    const { student_id } = req.user; 

    if (!course_code || !student_id) {
        return res.status(400).json({
            message: "Bad Request",
        });
    }

    let filter = { course_code, student_id };

    if (status && status.trim() !== "") {
        filter.status = status;
    }

  

    try {
       
        if (day || month || year) {
            let startDate = new Date();
            let endDate = new Date();
      
            if (year) {
              const convertedYear = year; 
              startDate.setUTCFullYear(convertedYear, 0, 1);
              endDate.setUTCFullYear(convertedYear, 11, 31);
      
              if (month) {
                startDate.setUTCMonth(month - 1, 1); 
                endDate.setUTCMonth(month - 1, new Date(convertedYear, month, 0).getDate()); 
              }
      
              if (day) {
                startDate.setUTCDate(day);  
                endDate.setUTCDate(day);  
              }
      
              startDate.setUTCHours(0, 0, 0, 0); 
              endDate.setUTCHours(23, 59, 59, 999); 
      
              filter.date = {
                $gte: startDate,
                $lte: endDate
              };
            }
          }
      
        const getAttendance = await Attendance.find(filter);

        if (!getAttendance || getAttendance.length === 0) {
            return res.status(404).json({
                message: "Attendance not found",
            });
        }
        // const formatDateToBuddhist = (date) => {
        //     const currentDate = new Date(date);
        //     const day = String(currentDate.getDate()).padStart(2, '0');
        //     const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        //     const year = currentDate.getFullYear() + 543;
        //     const hours = String(currentDate.getHours()).padStart(2, '0');
        //     const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        //     const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        //     return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        //   };

        return res.status(200).json({
            Attendance: getAttendance,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};





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
    const { course_code } = req.body;

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

            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

           
            const enrollments = await Enrollments.find({ course_code });

        
            const attendanceRecords = await Attendance.find({
                course_code,
                date: { $gte: startOfDay, $lt: endOfDay },
                status: 'เข้าเรียน'
            });

            
            const checkedInStudentsSet = new Set(attendanceRecords.map(record => record.student_id));

            
            const attendancePromises = enrollments.map(async (enrollment) => {
                if (!checkedInStudentsSet.has(enrollment.student_id)) {
                  
                    const currentDate = new Date();
                   

                    const attendance = new Attendance({
                        course_code,
                        student_id: enrollment.student_id,
                        student_fname: enrollment.student_fname,
                        student_lname: enrollment.student_lname,
                        email: enrollment.student_email,
                        status: 'ขาดเรียน',
                        date: currentDate, 
                    });
                    return await attendance.save();
                }
            });

            await Promise.all(attendancePromises);

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
    const { course_code, student_id } = req.body;
    const { first_name: student_fname, last_name: student_lname, email } = req.user;

    if (!course_code || !student_id) {
        return res.status(400).json({
            message: "Bad request",
        });
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

        
        const currentDate = new Date();

        

        const attendance = new Attendance({
            course_code,
            student_id,
            student_fname,
            student_lname,
            email,
            status: 'เข้าเรียน',
            date: currentDate,  
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


exports.updateAttendance = async (req , res) => {

    const { course_code, student_id , status} = req.body;

    try{

        const findstudent = await Attendance.findOne({ course_code, student_id})

        if(!findstudent){

            return res.status(404).json({

                message : "Not Found"

            })


        }

        const saveatten = await Attendance.findOneAndUpdate(

            {course_code , student_id},
            status,

            {new : true  ,runValidators : true}


        )

        return res.status(200).json({


            message : "Update SucessFuly",
            "Attendance": saveatten

        })


    }catch (err) {

        return res.status(500).json({

            message: err.message

        })

    }


}

exports.getAttenbyCourseCode = async (req, res) => {
    const { course_code, student_id, status, day, month, year } = req.query;
  
    if (!course_code) {
      return res.status(400).json({
        message: "bad request",
      });
    }
  
    let filter = { course_code };
  
    if (student_id && student_id.trim() !== "") {
      filter.student_id = student_id;
    }
  
    if (status && status.trim() !== "") {
      filter.status = status;
    }
  
    try {
      if (day || month || year) {
        let startDate = new Date();
        let endDate = new Date();
  
        if (year) {
          const convertedYear = year;
          startDate.setUTCFullYear(convertedYear, 0, 1);
          endDate.setUTCFullYear(convertedYear, 11, 31);
  
          if (month) {
            startDate.setUTCMonth(month - 1, 1);
            endDate.setUTCMonth(month - 1, new Date(convertedYear, month, 0).getDate());
          }
  
          if (day) {
            startDate.setUTCDate(day);
            endDate.setUTCDate(day);
          }
  
          startDate.setUTCHours(0, 0, 0, 0);
          endDate.setUTCHours(23, 59, 59, 999);
  
          filter.date = {
            $gte: startDate,
            $lte: endDate
          };
        }
      }
  
      const getatten = await Attendance.find(filter);
  
      if (!getatten || getatten.length === 0) {
        return res.status(404).json({
          message: "Not Found",
        });
      }
  
      const course = await Course.findOne({ course_code });
  
      if (!course) {
        return res.status(404).json({
          message: "Course Not Found",
        });
      }
  
     
    //   const formatDateToBuddhist = (date) => {
    //     const currentDate = new Date(date);
    //     const day = String(currentDate.getDate()).padStart(2, '0');
    //     const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    //     const year = currentDate.getFullYear() + 543;
    //     const hours = String(currentDate.getHours()).padStart(2, '0');
    //     const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    //     const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    //     return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    //   };
  
      const result = getatten.map(att => ({
        ...att._doc,
        course_name: course.course_name,
        
      }));
  
      return res.status(200).json({
        "Attendance": result
      });
  
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  };
  





exports.getAttendanceByStudentAndCourse = async (req, res) => {

    const {course_code} = req.query
    const {student_id} = req.user

    if(!course_code){

        return res.status(400).json({

            message: "Bad Request",

        })

    }

    try{
        const getAttendance = await Attendance.find({course_code} , {student_id})

        if(!getAttendance){

            return res.status({

                message : "Not Found"

            })


        }
        return res.status(200).json({

            "Attendance": getAttendance

        })

    }catch (err) {

        return res.status(500).json({

            message: err.message

        })

    }

}
