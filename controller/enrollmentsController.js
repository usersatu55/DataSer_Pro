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