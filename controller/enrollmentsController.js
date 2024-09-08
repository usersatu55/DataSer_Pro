const Enrollments = require('../schema/enrollmentsSchema')



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


    const {course_id ,student_id ,student_fname,student_lname , student_email} = req.body

    if(!course_id || !student_id || !student_fname || !student_lname , !student_email){

        return res.status(400).json({

            message : "Bad request",

        })

    }


    try{

        const checkenrollment = await Enrollments.findOne({course_id : course_id, student_id : student_id})

        if(checkenrollment){

            return res.status(400).json({

                message : "The student is already enrolled in this course",

            })

        }

        const newenrollment = new Enrollment({
            course_id,
            student_id,
            student_fname,
            student_lname,
            student_email
        })

        const savedEnrollment = await newenrollment.save()

        return res.status(200).json({

            message : "Enrollment saved successfully",
            "Enrollment": savedEnrollment

        })


    }catch(err){

        return res.status(500).json({

            message: err.message

        })

    }

}

exports.createEnrollmentsArray = async (req, res) => {
    
    const enrollments = req.body
    
    if(!enrollment || !Array.isArray(enrollment) || enrollments.length === 0){

        return res.status(400).json({

            message: "Bad request",

        })

    }


    try{

        const enrollmentsToinsert = []

        for(const enrollment of enrollments){

            const {course_id ,student_id ,student_fname,student_lname , student_email} = enrollment

            if(!course_id || !student_id || !student_fname || !student_lname || !student_email){

                return res.status(400).json({

                    message :"All fields are required"

                })

            }

            const checkEnrollment = await Enrollment.findOne({ course_id, student_id });
            
            if (checkEnrollment) {
                
                return res.status(400).json({
                    message: `Student ${student_id} is already enrolled in course ${course_id}`,
                
                });
            
            }

            enrollmentsToinsert.push({

                course_id ,
                student_id ,
                student_fname,
                student_lname , 
                student_email


            })

        }

        if(enrollmentToinsert.length > 0){

            const saveEnrollment = await Enrollment.insertMany(enrollmentsToinsert)

            return res.status(200).json({

                message: "Create Enrollment successfully",
                "Enrollment":saveEnrollment

            })

        }


    }catch(err){

    }

}

exports.deleteEnrollment = async (req ,res) => {

    const {course_id , student_id} = req.query

    if(!course_id || !student_id){

        return res.status(400).json({

            message: "Bad request",

        })

    }

    try{

        const checkenrollment = await Enrollments.findOne({course_id} , {student_id})

        if(!checkenrollment){

            return res.status(404).json({
                
                message: "The student has not taken this course"

            })

        }

        const deleteEnrollment = await Enrollments.findOneAndDelete({course_id} , {student_id})

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