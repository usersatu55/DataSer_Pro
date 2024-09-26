const Course = require('../schema/coursesSchema')


exports.getCoures = async (req , res) =>{

    try{
        
        getcoures = await Course.find()
        res.status(200).json(getcoures)

    } catch(err){
        res.status(500).json({message: err})
    }

}


exports.createCourse = async (req, res) => {
    const { course_code, course_name, course_time_slots, seat_limit } = req.body;
    const { first_name: instructor_fname, last_name: instructor_lname, email } = req.user;

   
    if (!course_code || !course_name || !course_time_slots || !seat_limit) {
        return res.status(400).json({ message: "Bad request" });
    }

    try {

        const checkcourse = await Course.findOne({course_code})

        if(checkcourse){

            return res.status(400).json({

                "message": "Course already exists"

            })

        }

        const newCourse = new Course({
            course_code,
            course_name,
            instructor_fname,
            instructor_lname,
            email,
            course_time_slots,
            seat_limit,  
            current_enrollments: 0
        });

        const savedCourse = await newCourse.save();
        return res.status(201).json({
            message: "Course created successfully",
            course: savedCourse
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};



exports.deleteCourse = async (req , res) =>{


    const {course_code} = req.query

    if(!course_code){
        
        return res.status(400).json({

            message :"Bad request",

        })

    }

    try{

        const deletecourse = await Course.findOneAndDelete({course_code: course_code})

        if(!deletecourse){

            return res.status(404).json({

                message :"Course not found",

            })

        }

        return res.status(200).json({

            message :"Course deleted successfully",

        })


    }catch(err){

        return res.status(500).json({
            
            message: err.message

        })

    }
}

exports.updateCourse = async (req, res) => {

    const { course_code } = req.query; 
    const {new_course_code, course_name , course_time_slots} = req.body;  

    if (!course_code) {
        return res.status(400).json({
            message: "Bad request",
        });
    }

    const courseupdate = {}; 

   
    if (new_course_code && new_course_code.trim() !== "") courseupdate.course_code = new_course_code;
    if (course_name && course_name.trim() !== "") courseupdate.course_name = course_name;
    if (course_time_slots && course_time_slots.trim() !== "") courseupdate.course_time = course_time;

    try {
        
        if (new_course_code && new_course_code.trim() !== "") {
            const checkCourseCode = await Course.findOne({ course_code: new_course_code });
            if (checkCourseCode) {
                return res.status(400).json({
                    message: "Course code already exists",
                });
            }
        }

        const savecourse = await Course.findOneAndUpdate(
            { course_code },  
            courseupdate,
            { new: true, runValidators: true }
        );

        if (!savecourse) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        return res.status(200).json({
            message: "Course updated successfully",
            course: savecourse,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

exports.getCourseBy = async (req , res) =>{


    const {email} =req.user

    try{

        const getcourse = await Course.find({email})

        if(!getcourse){

            return res.status(404).json({

                message: 'Course not found'

            })


        }
        return res.status(200).json({

            course: getcourse

        })


    }catch(err){

        return res.status(500).json({

            message: err.message

        })
        
    }

}
