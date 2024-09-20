const Enrollments = require('../schema/enrollmentsSchema')
const Course = require('../schema/coursesSchema')
const Student = require('../schema/studentSchema')



exports.getEnrollments = async (req , res) =>{

   
    try{
        const getEnrollments = await Enrollments.find()

        if(!getEnrollments){

            return res.status(404).json({

                message : 'Enrollments not found'
            })

        }

        return res.status(200).json({

            getEnrollments

        })

    }catch(err){

        return res.status(500).json({

            message : err.message

        })

    }

}

exports.createEnrollments = async (req, res) => {
    const { course_code} = req.body;
    const { student_id, first_name:student_fname,last_name:student_lname, email:student_email} = req.user

    
    if (!course_code || !student_id || !student_fname || !student_lname || !student_email) {
        return res.status(400).json({
            message: "Bad request",
        });
    }

    try {
     
        const course = await Course.findOne({ course_code });

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        
        if (course.current_enrollments >= course.seat_limit) {
            return res.status(400).json({
                message: "Course enrollment limit has been reached",
            });
        }

      
        const checkEnrollment = await Enrollments.findOne({ course_code, student_id });

        if (checkEnrollment) {
            return res.status(400).json({
                message: "The student is already enrolled in this course",
            });
        }

       
        const newEnrollment = new Enrollments({
            course_code,
            student_id,
            student_fname,
            student_lname,
            student_email,
            deletedAt: null
        });

        const savedEnrollment = await newEnrollment.save();

       
        course.current_enrollments += 1;
        await course.save();

        return res.status(200).json({
            message: "Enrollment saved successfully",
            Enrollment: savedEnrollment,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};



exports.createEnrollmentsArray = async (req, res) => {

    const enrollments = req.body;

    
    if (!enrollments || !Array.isArray(enrollments) || enrollments.length === 0) {
        return res.status(400).json({
            message: "Bad request",
        });
    }

    try {
        const enrollmentsToinsert = [];

        
        for (const enrollment of enrollments) {
            const { course_code, student_id, student_fname, student_lname, student_email } = enrollment;

            
            if (!course_code || !student_id || !student_fname || !student_lname || !student_email) {
                return res.status(400).json({
                    message: "All fields are required",
                });
            }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            
            const checkEnrollment = await Enrollments.findOne({ course_code, student_id });

            if (checkEnrollment) {
                return res.status(400).json({
                    message: `Student ${student_id} is already enrolled in course ${course_code}`,
                });
            }

          
            enrollmentsToinsert.push({
                course_code,
                student_id,
                student_fname,
                student_lname,
                student_email,
            });
        }

        
        if (enrollmentsToinsert.length > 0) {
            const saveEnrollment = await Enrollments.insertMany(enrollmentsToinsert);

            return res.status(200).json({
                message: "Enrollments created successfully",
                Enrollment: saveEnrollment,
            });
        } else {
            return res.status(400).json({
                message: "No valid enrollments to insert",
            });
        }

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};


exports.deleteEnrollment = async (req ,res) => {

    const {course_code , student_id} = req.query

    if(!course_code || !student_id){

        return res.status(400).json({

            message: "Bad request",

        })

    }

    try{

        const checkenrollment = await Enrollments.findOne({course_code} , {student_id})

        if(!checkenrollment){

            return res.status(404).json({
                
                message: "The student has not taken this course"

            })

        }

        const deleteEnrollment = await Enrollments.findOneAndDelete({course_code} , {student_id})

        return res.status(200).json({

            message: "Enrollment deleted successfully",
            Enrollment: deleteEnrollment

        })


    }catch(err){

        return res.status(500).json({

            message: err.message

        })

    }

}


exports.getEnrollmentsByStudent = async (req, res) => {
    const { student_id } = req.user;

    try {
       
        const getEnrollment = await Enrollments.find({ student_id });

        if (!getEnrollment || getEnrollment.length === 0) {
            return res.status(404).json({
                message: "Enrollments not found for this student"
            });
        }

        
        const enrichedEnrollments = await Promise.all(
            getEnrollment.map(async (enrollment) => {
                const course = await Course.findOne({ course_code: enrollment.course_code });
                
                return {
                    ...enrollment._doc, 
                    course_name: course ? course.course_name : "Course not found",
                    instructor_fname: course ? course.instructor_fname : "Instructor not found",
                    instructor_lname: course ? course.instructor_lname : "Instructor not found",
                    email: course ? course.email : "Email not found",
                    course_time_slots: course ? course.course_time_slots : []  
                };
            })
        );

        return res.status(200).json({
            "Enrollments": enrichedEnrollments
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};


exports.getEnrollmentByCourse = async (req, res) => {
    const {course_code} = req.query;
  
    if (!course_code) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }
  
    try {
   
      const getEnrollment = await Enrollments.find({ course_code });
  
      if (!getEnrollment || getEnrollment.length === 0) {
        return res.status(404).json({
          message: "Not Found",
        });
      }
  
      
      const studentIds = getEnrollment.map((enrollment) => enrollment.student_id);
  
     
      const students = await Student.find({ student_id: { $in: studentIds } });
  
      
      const studentMap = {};
      students.forEach((student) => {
        studentMap[student.student_id] = student.department; 
      });
  
      
      const enrollmentsWithDepartment = getEnrollment.map((enrollment) => ({
        ...enrollment._doc,
        department: studentMap[enrollment.student_id] || "Unknown", 
      }));
  
      return res.status(200).json({
        Enrollments: enrollmentsWithDepartment,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  };
  

exports.getStudentInEnrollment = async (req, res) => {

    const {course_code} = req.query

    if(!course_code) {

        return res.status(400).json({

            message : "Bad Request"

        })

    }

    try{

        const getStudent = await Enrollments.find({course_code})

        if(!getStudent){

            return res.status(404).json({

                message : "Student Not Found"

            })

        }

        return res.status(200).json({

            "Enrollment":getStudent

        })


    }catch(err){

        return res.status(500).json({

            message : err.message

        })

    }

}