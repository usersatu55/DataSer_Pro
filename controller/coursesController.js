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
    
    
    const { course_code, course_name, course_days, course_time_slots } = req.body;
    const { first_name: instructor_fname, last_name: instructor_lname, email } = req.user;

    if (!course_code || !course_name || !course_days || !course_time_slots || course_days.length !== course_time_slots.length) {
        
        return res.status(400).json({ message: "Bad request" });
    }

    try {
        const newCourse = new Course({
            course_code,
            course_name,
            instructor_fname,
            instructor_lname,
            email,
            course_days,
            course_time_slots
        });

        const savedCourse = await newCourse.save();
        return res.status(200).json({
            message: "Create course successfully",
            course: savedCourse
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
