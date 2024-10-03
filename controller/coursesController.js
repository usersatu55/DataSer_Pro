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

                "message": "รหัสคอร์สนี้ถูกใช้ไปเเล้ว"

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
    const { course_name, course_time_slots, seat_limit } = req.body;

    if (!course_code) {
        return res.status(400).json({ message: "Bad request: course_code is required" });
    }

    
    const updateCourse = {};
    if (course_name) updateCourse.course_name = course_name;
    if (course_time_slots) updateCourse.course_time_slots = course_time_slots;
    if (seat_limit) updateCourse.seat_limit = seat_limit;

    if (Object.keys(updateCourse).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
    }

    try {
        const savecourse = await Course.findOneAndUpdate(
            { course_code },
            updateCourse,
            { new: true, runValidators: true }
        );

        if (!savecourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        return res.status(200).json({ savecourse });
    } catch (err) {
        return res.status(500).json({ message: err.message });
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


exports.getCourseByCode = async(req, res) => {

    const {course_code} = req.query


    if(!course_code) {

        return res.status(400).json({

            message: " Bad Request"

        })

    }


    try{

        const getcourse = await Course.findOne({course_code})

        if(!getcourse){

            return res.status(404).json({

                message: "Course not found"

            })


        }
        return res.status(200).json({

            Course: getcourse

        })

    }catch(err){

        return res.status(500).json({

            message: err.message


        })

    }

}