const jwt = require('jsonwebtoken');
const ResponseHandler = require('../constant/common');
const CommonMethods = require("../utils/utilities");

const verifyToken = async (req, res, next) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return response.Error('No token, authorization denied', []);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    
    if (err.name === 'TokenExpiredError') {
      return response.Error('Token has expired', []);
    } else {
      return response.Error('Invalid token', []);
    }
  }
};

module.exports = { verifyToken };
