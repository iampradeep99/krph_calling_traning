const Joi = require('joi');

const validateAgentData = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),  // Assumes 10-digit mobile number
    password: Joi.string().min(6).max(20).required(),
    designation: Joi.string().valid('agent', 'admin', 'moderator').required(), // assuming only these designations
    country: Joi.string().required(),  // Assuming ObjectId or valid country ID
    state: Joi.string().required(),    // Assuming ObjectId or valid state ID
    city: Joi.string().required(),     // Assuming ObjectId or valid city ID
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();  // Proceed to the next middleware (i.e., the createAgent function)
};

module.exports = { validateAgentData };
