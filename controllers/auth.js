const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResponseHandler = require('../constant/common');
const CommonMethods = require("../utils/utilities");
const responseConst = require('../constant/constantElements');
const mongoose = require('mongoose');
const moment = require('moment');
const Mailer = require('../middlewares/sendMail');
const templates = require('../templates/accountTemplate')



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
      loginTime: moment().format('DD/MM/YYYY HH:mm:ss'),  // Current time formatted
      expiryTime: moment().add(12, 'hours').format('DD/MM/YYYY HH:mm:ss')  // 12 hours added and formatted
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

const forgetPassword = async (req, res) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();
  const mailer = new Mailer();
  const { email } = req.body;

  if (!email || !utils.validateEmail(email)) {
    return response.Error("Invalid or missing email address", []);
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return response.Error("User not found with the provided email address", []);
    }
    const payload = {
      userId: user._id,
      role: user.role,
      status: user.status,
      email: user.email,
    };

    const resetToken = await utils.generateToken(payload, { expiresIn: '1h' });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { token:resetToken },
      { new: true }
    );
    if (updatedUser) {
      const resetLink = `${process.env.FRONTENDURL}/reset-password?token=${resetToken}`;
      const emailTemplate = await templates.forgotPasswordEmailTemplate(
        `${user.firstName} ${user.lastName}`,
        resetLink
      );

      await mailer.sendMail(user.email, 'Password Reset Request', '', emailTemplate);

      return response.Success("Password reset link sent successfully", []);
    }

    return response.Error("Failed to update user with reset token", []);
  } catch (err) {
    console.log(err)
    console.error(`Error during password reset for email ${email}:`, err);

    return response.Error("Something went wrong. Please try again later.", []);
  }
};

const updateResetPassword = async (req, res) => {
  const response = new ResponseHandler(res);
  console.log(req.body)
  const { userId, password, confirmPassword } = req.body;
  const token = req.body.token;

  try {
    if (!userId || !password || !confirmPassword) {
      return response.Error("User ID, password, and confirm password are required", []);
    }

    if (password != confirmPassword) {
      return response.Error("Passwords do not match", []);
    }

    const user = await User.findOne({_id:mongoose.Types.ObjectId(userId)});
    console.log(user)
    if (!user) {
      return response.Error("User not found", []);
    }

    if (!token || token !== user.token) {
      return response.Error("Link has expired or the token is invalid", []);
    }

    const isNewPasswordSameAsCurrent = await bcrypt.compare(password, user.password);
    if (isNewPasswordSameAsCurrent) {
      return response.Error("The new password cannot be the same as your current password", []);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Update both password and token to an empty string in a single query
    const updateData = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { password: hashedPassword, token: "" } },
      { new: true }
    );
    
    if (updateData) {
      return response.Success("Password updated successfully", []);
    }

  } catch (err) {
    console.log(err)
    console.error("Error during password update:", err);
    return response.Error("Something went wrong. Please try again later.", []);
  }
};





module.exports = { login,forgetPassword,updateResetPassword };
