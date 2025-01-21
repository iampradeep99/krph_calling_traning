const jwt = require('jsonwebtoken');
const ResponseHandler = require('../constant/common');
const CommonMethods = require("../utils/utilities");

const verifyToken = async (req, res, next) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return response.Error('No token, authorization denied', [], 401);  
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);

    if (err.name === 'TokenExpiredError') {
      return response.Error('Token has expired', [], 401);  
    } else {
      return response.Error('Invalid token', [], 401);  
    }
  }
};

module.exports = { verifyToken };
