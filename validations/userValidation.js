const Joi = require('joi');
const ResponseHandler = require('../constant/common');

const validateAgentData = (req, res, next) => {
  const response = new ResponseHandler(res);
  
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
    gender: Joi.number().valid(0, 1, 2).optional(),  // 0 = Male, 1 = Female, 2 = Others
    dob: Joi.date().optional(),
    qualification: Joi.string().optional(),
    experience: Joi.string().optional(),
    role: Joi.number().valid(0, 1, 2, 3).default(3),  // 0 = SuperAdmin, 1 = Admin, 2 = Moderator, 3 = Agent
    location: Joi.string().required(),
    menuPermission: Joi.array().items(Joi.string().required()).required(),  // menuPermission is required
    assignedProfile: Joi.string().allow('').optional(),// assignedProfile is required for creating an agent
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return response.Error(error.details[0].message, []);
  }
  next();  // Proceed to the next middleware (i.e., the createAgent function)
};

const validateAgentDataUpdate = (req, res, next) => {
  const response = new ResponseHandler(res);
  
  // Define the Joi schema for updating an agent
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().min(6).max(20).optional(),  // Password is optional in update
    designation: Joi.string().valid('agent', 'admin', 'moderator').required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    agentId: Joi.string().required(),  // Agent ID is required for update
    gender: Joi.number().valid(0, 1, 2).optional(),  // 0 = Male, 1 = Female, 2 = Others
    dob: Joi.date().optional(),
    qualification: Joi.string().optional(),
    experience: Joi.string().optional(),
    role: Joi.number().valid(0, 1, 2, 3).optional(),
    location: Joi.string().optional(),
    menuPermission: Joi.array().items(Joi.string().required()).optional(),  // menuPermission is optional in update
    assignedProfile: Joi.string().optional(),  // assignedProfile is optional for update
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return response.Error(error.details[0].message, []);
  }
  next();  // Proceed to the next middleware (i.e., the createAgent function)
};

const validateAdminOrTrainerData = (req, res, next) => {
  const response = new ResponseHandler(res);

  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required().messages({
      'any.required': 'First name is required',
    }),
    lastName: Joi.string().min(3).max(50).required().messages({
      'any.required': 'Last name is required',
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.email': 'Invalid email format',
    }),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
      'any.required': 'Mobile number is required',
      'string.pattern.base': 'Invalid mobile number format',
    }),
    role: Joi.number().valid(0, 1, 2, 3).default(1).messages({
      'number.base': 'Invalid role value',
    }),
    gender: Joi.number().valid(0, 1, 2).required().messages({
      'any.required': 'Gender is required',
      'number.base': 'Invalid gender value',
    }),
    region: Joi.string().required().messages({
      'any.required': 'Region is required',
    }),
    state: Joi.string().required().messages({
      'any.required': 'State is required',
    }),
    city: Joi.string().required().messages({
      'any.required': 'City is required',
    }),
    dob: Joi.date().required().messages({
      'any.required': 'Date of Birth is required',
      'date.base': 'Invalid Date of Birth format',
    }),
    location: Joi.string().required().messages({
      'any.required': 'Location is required',
    }),
    _id: Joi.string().optional(), // _id is optional for new users

   
  });

  // Validate the request body using Joi
  const { error } = schema.validate(req.body);
  if (error) {
    return response.Error(error.details[0].message, []);
  }

  // Proceed to the next middleware/controller
  next();
};
const validateSupervisorData = (req, res, next) => {
  const response = new ResponseHandler(res);

  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required().messages({
      'any.required': 'First name is required',
    }),
    lastName: Joi.string().min(3).max(50).required().messages({
      'any.required': 'Last name is required',
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.email': 'Invalid email format',
    }),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
      'any.required': 'Mobile number is required',
      'string.pattern.base': 'Invalid mobile number format',
    }),
    role: Joi.number().valid(0, 1, 2, 3).default(1).messages({
      'number.base': 'Invalid role value',
    }),
    gender: Joi.number().valid(0, 1, 2).required().messages({
      'any.required': 'Gender is required',
      'number.base': 'Invalid gender value',
    }),
    region: Joi.string().required().messages({
      'any.required': 'Region is required',
    }),
    state: Joi.string().required().messages({
      'any.required': 'State is required',
    }),
    city: Joi.string().required().messages({
      'any.required': 'City is required',
    }),
    dob: Joi.date().required().messages({
      'any.required': 'Date of Birth is required',
      'date.base': 'Invalid Date of Birth format',
    }),
    location: Joi.string().required().messages({
      'any.required': 'Location is required',
    }),
    _id: Joi.string().optional(), // _id is optional for new users

    adminId: Joi.string().required().messages({
      'any.required': 'Admin ID is required',
    }),
  });

  // Validate the request body using Joi
  const { error } = schema.validate(req.body);
  if (error) {
    return response.Error(error.details[0].message, []);
  }

  // Proceed to the next middleware/controller
  next();
};

module.exports = { validateAgentData, validateAgentDataUpdate,validateAdminOrTrainerData,validateSupervisorData };
