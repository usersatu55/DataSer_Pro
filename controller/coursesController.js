const Course = require('../schema/coursesSchema')


exports.getCoures = async (req , res) =>{

    try{
        
        getcoures = await Course.find()
        res.status(200).json(getcoures)

    } catch(err){
        res.status(500).json({message: err})
    }

}


exports.createCourse = async (req , res) =>{

    const {course_code , course_name ,  instructor} = req.body

    if (!course_code || !course_name || !instructor){

        return res.status(400).json({
            message: "Bad request"
        })
    }

    try{
        const nweCoures = new Course({
            courses:[
                {
                    course_code , 
                    course_name ,  
                    instructor 
                }
            ]
        })
        await nweCoures.save()
        res.status(200).json(nweCoures)
    } catch(err){
        return res.status(500).json({
            message: err.message
        })
    }


}