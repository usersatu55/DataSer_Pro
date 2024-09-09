const Enrollments = require('../schema/enrollmentsSchema')



exports.getEnrollments = async (req , res) =>{

    const {student_id} = req.user


    try{
        const getEnrollments = await Enrollments.find({student_id})

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

    const { course_code, student_id, student_fname, student_lname, student_email } = req.body;

   
    if (!course_code || !student_id || !student_fname || !student_lname || !student_email) {
        return res.status(400).json({
            message: "Bad request",
        });
    }

    try {
        
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
            deletedAt:null
        });

        const savedEnrollment = await newEnrollment.save();

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