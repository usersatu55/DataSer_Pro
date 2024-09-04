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

  


}