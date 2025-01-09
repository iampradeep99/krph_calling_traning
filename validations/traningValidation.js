const Joi = require('joi');
const ResponseHandler = require('../constant/common');





const validateTraningData = (req, res, next)=>{
    const response = new ResponseHandler(res)
    const schema = Joi.object({
        agents: Joi.array().items(
            Joi.object({
                agentId: Joi.string().hex().length(24).required() 
            })
        ).required(),
        trainingLanguage: Joi.string().hex().length(24).required(),  
        trainingModule: Joi.string().hex().length(24).required(),    
        trainingScheduledDate: Joi.date().iso().required(),           
        trainingStartTime: Joi.date().iso().optional(),              
        trainingEndTime: Joi.date().iso().optional(),                 
        trainingMode: Joi.string().hex().length(24).required(),       
        trainingLink: Joi.string().uri().optional()                   
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return response.Error(error.details[0].message, [])
    }
    next(); 
}

module.exports = { validateTraningData };
