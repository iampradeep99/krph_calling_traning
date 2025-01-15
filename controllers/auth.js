const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResponseHandler = require('../constant/common');
const CommonMethods = require("../utils/utilities");
const responseConst = require('../constant/constantElements');
const mongoose = require('mongoose');

const login = async (req, res) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();

  try {
    const { email, password } = req.body;
    const userInfo = await User.findOne({ email: email.toLowerCase() });

    if (!userInfo) {
      return response.Error("User Not Found", []);
    }

    const isMatch = await bcrypt.compare(password, userInfo.password.trim());
    if (!isMatch) {
      return response.Error("Invalid Credentials", []);
    }

     const payload = {
      userId: userInfo._id,
      username: userInfo.username,
      privilegeType: userInfo.privilegeType,
      loginTime: Date.now(), 
      expiryTime: Date.now() + 12 * 60 * 60 * 1000  
    };
    

    const token = await utils.generateToken(payload);

    if (token) {
      await User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(userInfo._id) },
        { token },
        { new: true }
      );
    }

    const tokenResp = [{ token }];
    const compressResponse = await utils.GZip(tokenResp);
    return response.Success(responseConst.LOGINSUCCESS, compressResponse);

  } catch (err) {
    console.error(err);
    return response.Error("Server error", []);
  }
};

module.exports = { login };
