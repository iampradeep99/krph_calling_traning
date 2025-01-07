const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assuming you have the User model

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email:email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = {
      userId: user._id,
      username: user.username,
      privilegeType: user.privilegeType,
    };

    const token = jwt.sign(payload, process.env.JWTSECRETKEY, { expiresIn: process.env.EXPIRYTIME });

    res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };
