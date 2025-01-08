const Joi = require('joi');
const ResponseHandler = require('../constant/common');


const validateLogin = (req, res, next) => {
  const response = new ResponseHandler(res)

  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
      }),

    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
      }),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return response.Error(error.details[0].message, [])

  }

  next();
};

module.exports = { validateLogin };
