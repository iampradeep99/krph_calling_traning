const bcrypt = require('bcryptjs');
const User = require('../models/User'); 

const createAgent = async (req, res) => {
  try {
    if (req.user.privilegeType !== 'admin' && req.user.privilegeType !== 'superadmin') {
      return res.status(403).json({ message: 'Unauthorized, only admins can create agents' });
    }
    const { firstName, lastName, email, mobile, password, designation, country, state, city } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ message: 'Mobile number is already registered' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const agent = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,  
      designation: designation,
      country,
      state,
      city,
      privilegeType: 'user',
    });

    await agent.save();

    const agentResponse = {
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      mobile: agent.mobile,
      designation: agent.designation,
      country: agent.country,
      state: agent.state,
      city: agent.city,
      privilegeType: agent.privilegeType,
    };

    res.status(201).json({
      message: 'Agent created successfully',
      agent: agentResponse,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, could not create agent' });
  }
};

module.exports = { createAgent };
