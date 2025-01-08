const User = require('../models/User');
const ResponseHandler = require('../constant/common');
const CommonMethods = require("../utils/utilities");
const bcrypt = require('bcryptjs');
const responseElement = require('../constant/constantElements')
const mongoose = require('mongoose')

const createAgent = async (req, res) => {
  try {
    const response = new ResponseHandler(res);
    const { firstName, lastName, email, mobile, password, designation, country, state, city } = req.body;
    const utils = new CommonMethods(firstName, 8);
    let compressResponse;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      compressResponse = await utils.GZip([]);
      return response.Success("Email is already registered", compressResponse);
    }

    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      compressResponse = await utils.GZip([]);
      return response.Success("Mobile number is already registered", compressResponse);
    }

    const userName = utils.generateRandomAlphanumeric();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const agent = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      designation,
      country,
      state,
      city,
      username:firstName.toUpperCase()
      
    });

   let savedInfo =  await agent.save();
   if(savedInfo){
    await User.findOneAndUpdate({_id:mongoose.Types.ObjectId(savedInfo._id)},{$set:{uniqueUserName:`${savedInfo.username}-${savedInfo.userNameDigit}`}},{new:true})
   }

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

    compressResponse = await utils.GZip(agentResponse);
    return response.Success(responseElement.AGENTADD, compressResponse);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, could not create agent' });
  }
};


const updateAgent = async (req, res) => {
  try {
    const response = new ResponseHandler(res);
    const { agentId, firstName, lastName, email, mobile, password, designation, country, state, city } = req.body;
    const utils = new CommonMethods(firstName, 8);
    let compressResponse;

    const agent = await User.findById(agentId);
    if (!agent) {
      compressResponse = await utils.GZip([]);
      return response.Success("Agent not found", compressResponse);
    }

    // Email should not be updated. If email is provided, ignore it
    if (email && email !== agent.email) {
      compressResponse = await utils.GZip([]);
      return response.Success("Email cannot be updated", compressResponse);
    }

    // Ensure the mobile number is unique (it can be updated)
    if (mobile && mobile !== agent.mobile) {
      const existingMobile = await User.findOne({ mobile, _id: { $ne: agentId } });
      if (existingMobile) {
        compressResponse = await utils.GZip([]);
        return response.Success("Mobile number is already registered", compressResponse);
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      agent.password = hashedPassword;
    }

    agent.firstName = firstName || agent.firstName;
    agent.lastName = lastName || agent.lastName;
    agent.mobile = mobile || agent.mobile;
    agent.designation = designation || agent.designation;
    agent.country = country || agent.country;
    agent.state = state || agent.state;
    agent.city = city || agent.city;

   let savedInfo =  await agent.save();

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

    compressResponse = await utils.GZip(agentResponse);
    return response.Success(responseElement.AGENTUPDATE, compressResponse);


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, could not update agent' });
  }
};



const agentList = async (req, res) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();

  try {
    const { page = 1, limit = 10, searchQuery = '' } = req.body;

    let searchCondition = {};
    if (searchQuery) {
      searchCondition = {
        status:0,
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { uniqueUserName: { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    let query = [
      { $match: searchCondition },
      { 
        $sort: { 
          createdAt: -1, 
          email: 1,       
          mobile: 1,      
          uniqueUserName: 1 
        }
      }
    ];

    const options = {
      page,
      limit,
      customLabels: { totalDocs: 'total', docs: 'agents' },
    };

    const myAggregate = User.aggregate(query);
    const getData = await User.aggregatePaginate(myAggregate, options);

    if (getData && getData.agents.length > 0) {
      const compressResponse = await utils.GZip(getData);
      response.Success(responseElement.AGENTFETCHED, compressResponse);
    } else {
      response.Success(responseElement.NO_AGENTS_FOUND, []);
    }

  } catch (err) {
    console.log(err);
    response.Error(responseElement.INTERNAL_ERROR, err.message);
  }
};







module.exports = { createAgent,updateAgent,agentList };
