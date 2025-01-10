const Joi = require('joi');
const ResponseHandler = require('../constant/common');


const validateAgentData = (req, res, next) => {
  const response = new ResponseHandler(res)
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),  
    password: Joi.string().min(6).max(20).required(),
    designation: Joi.string().valid('agent', 'admin', 'moderator').required(), 
    country: Joi.string().required(),  
    state: Joi.string().required(),    
    city: Joi.string().required(), 
    menuPermission: Joi.array().items(Joi.string().required()).required()
     
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return response.Error(error.details[0].message, [])
  }
  next();  // Proceed to the next middleware (i.e., the createAgent function)
};

const validateAgentDataUpdate = (req, res, next) => {
  const response = new ResponseHandler(res)
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),  
    password: Joi.string().min(6).max(20).required(),
    designation: Joi.string().valid('agent', 'admin', 'moderator').required(), 
    country: Joi.string().required(),  
    state: Joi.string().required(),    
    city: Joi.string().required(),  
    agentId: Joi.string().required(), 
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return response.Error(error.details[0].message, [])
  }
  next();  // Proceed to the next middleware (i.e., the createAgent function)
};

module.exports = { validateAgentData,validateAgentDataUpdate };
