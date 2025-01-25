const User = require('../models/User');
const Profile = require('../models/Profile');
const ResponseHandler = require('../constant/common');
const CommonMethods = require("../utils/utilities");
const bcrypt = require('bcryptjs');
const responseElement = require('../constant/constantElements')
const mongoose = require('mongoose');
const { request } = require('../app');
const STATE = require('../models/State');
const { assignProfile } = require('./profile');
const Mailer = require('../middlewares/sendMail');
const templates = require('../templates/accountTemplate')


// const createAgent = async (req, res) => {
//   try {
//     const response = new ResponseHandler(res);
//     const { firstName, lastName, email, mobile, password, designation, country, state, city, menuPermission } = req.body;
//     const utils = new CommonMethods(firstName, 8);
//     let compressResponse;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       compressResponse = await utils.GZip([]);
//       return response.Success("Email is already registered", compressResponse);
//     }

//     const existingMobile = await User.findOne({ mobile });
//     if (existingMobile) {
//       compressResponse = await utils.GZip([]);
//       return response.Success("Mobile number is already registered", compressResponse);
//     }

//     const userName = utils.generateRandomAlphanumeric();
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const agent = new User({
//       firstName,
//       lastName,
//       email,
//       mobile,
//       password: hashedPassword,
//       designation,
//       country,
//       state,
//       city,
//       username: firstName.toUpperCase(),
//       menuPermission
//     });

//     let savedInfo = await agent.save();
//     if (savedInfo) {
//       await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(savedInfo._id) }, { $set: { uniqueUserName: `${savedInfo.username}-${savedInfo.userNameDigit}` } }, { new: true });
//     }

//     const agentResponse = {
//       firstName: agent.firstName,
//       lastName: agent.lastName,
//       email: agent.email,
//       mobile: agent.mobile,
//       designation: agent.designation,
//       country: agent.country,
//       state: agent.state,
//       city: agent.city,
//       privilegeType: agent.privilegeType,
//       menuPermission: agent.menuPermission
//     };

//     compressResponse = await utils.GZip(agentResponse);
//     return response.Success(responseElement.AGENTADD, compressResponse);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error, could not create agent' });
//   }
// };

const createAgent = async (req, res) => {
  try {
      const response = new ResponseHandler(res);
      const mailer = new Mailer();
      let newUserName;
      const {
          firstName,
          lastName,
          email,
          mobile,
          designation,
          role,
          region,
          state,
          city,
          gender,
          dob,
          qualification,
          experience,
          location,
          refId,
          admin,
          supervisor
      } = req.body;
      const utils = new CommonMethods(firstName, 8);
      if (role == 3) {
          let getLastRecord = await User.find({
                  role: 3
              })
              .sort({
                  createdAt: -1
              })
              .limit(1);

          if (getLastRecord.length > 0) {
              const lastUserName = getLastRecord[0].userName;
              const lastNumber = parseInt(lastUserName.split('-')[1], 10);
              const newNumber = lastNumber + 1;
              newUserName = `AGT-${newNumber.toString().padStart(4, '0')}`;
          }
      }

      const existingUser = await User.findOne({
          email
      });
      if (existingUser) {
          let compressResponse = await utils.GZip([]);
          return response.Error("Email is already registered", compressResponse);
      }

      const existingMobile = await User.findOne({
          mobile
      });
      if (existingMobile) {
          let compressResponse = await utils.GZip([]);
          return response.Error("Mobile number is already registered", compressResponse);
      }

      let newPassword = utils.generateRandomPassword(8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      let profile = await Profile.findOne({profileId:1004})
      

      const agent = new User({
          firstName,
          lastName,
          email,
          mobile,
          password: hashedPassword,
          designation,
          region,
          state,
          city,
          gender,
          dob,
          qualification,
          experience,
          location,
          status: 0,
          userName: newUserName,
          role: role,
          userRefId: refId,
          passwordPlain: newPassword,
          adminId:admin,
          supervisorId:supervisor,
          assignedProfile:profile._id
      });

      let savedInfo = await agent.save();
      if(savedInfo){
        const to = savedInfo.email;
        const subject = 'CSC Agent Training';
        const text = '';
        const html = await templates.accountDetails(savedInfo.email,newPassword,savedInfo.firstName,"http://45.250.3.34/" )
        await mailer.sendMail(to, subject, text, html);
        console.log('Email sent successfully');
  
       }

      const agentResponse = {
          firstName: agent.firstName,
          lastName: agent.lastName,
          email: agent.email,
          mobile: agent.mobile,
          designation: agent.designation,
          region: agent.region,
          state: agent.state,
          city: agent.city,
          gender: agent.gender,
          dob: agent.dob,
          qualification: agent.qualification,
          experience: agent.experience,
          status: agent.status,
          location: agent.location,
          assignedProfile: agent.assignedProfile
      };

      let compressResponse = await utils.GZip(agentResponse);
      return response.Success(responseElement.AGENTADD, compressResponse);

  } catch (err) {
      console.error(err);
      res.status(500).json({
          message: 'Server error, could not create agent'
      });
  }
};

const updateAgent = async (req, res) => {
  const response = new ResponseHandler(res);
  const { 
    agentId, firstName, lastName, mobile, designation, region,  // Changed 'country' to 'region'
    state, city, gender, dob, qualification, experience, location, assignedProfile 
  } = req.body;
  
  const utils = new CommonMethods(firstName, 8);
  let compressResponse;

  try {
    const agent = await User.findById(agentId);
    if (!agent) {
      compressResponse = await utils.GZip({ message: 'Agent not found' });
      return response.Success("Agent not found", compressResponse);
    }

    // Assigning values with fallback to existing agent data
    agent.firstName = firstName || agent.firstName;
    agent.lastName = lastName || agent.lastName;
    agent.mobile = mobile || agent.mobile;
    agent.designation = designation || agent.designation;
    agent.region = region || agent.region;  // Using 'region' instead of 'country'
    agent.state = state || agent.state;
    agent.city = city || agent.city;
    agent.gender = gender || agent.gender;
    agent.dob = dob || agent.dob;
    agent.qualification = qualification || agent.qualification;
    agent.experience = experience || agent.experience;
    agent.location = location || agent.location;
    agent.assignedProfile = assignedProfile || agent.assignedProfile; // Add assignedProfile if provided

    let savedInfo = await agent.save();

    const agentResponse = {
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      mobile: agent.mobile,
      designation: agent.designation,
      region: agent.region,  // Make sure region is included in the response
      state: agent.state,
      city: agent.city,
      gender: agent.gender,
      dob: agent.dob,
      qualification: agent.qualification,
      experience: agent.experience,
      username: agent.username,
      status: agent.status,
      location: agent.location,
      assignedProfile: agent.assignedProfile,
    };

    compressResponse = await utils.GZip(agentResponse);
    return response.Success(responseElement.AGENTUPDATE, compressResponse);

  } catch (err) {
    console.error(err);
    compressResponse = await utils.GZip({ message: 'Server error, could not update agent' });
    return response.Error('Server error, could not update agent', compressResponse);
  }
};



const addUpdateAdminOrTrainer = async (req, res) => {
  const response = new ResponseHandler(res);
  const { generateRandomPassword } = new CommonMethods();
  const mailer = new Mailer();
  const utils = new CommonMethods();
  try {
    const { userId: addedBy } = req.user;
    const { _id,email, mobile } = req.body;
    let compressResponse;

    const [isEmailExist, isMobileExist] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ mobile })
    ]);

    if (isEmailExist) {
      compressResponse = await utils.GZip([]);
      return response.Error("Email already exists", compressResponse);
    }
    if (isMobileExist) {
      compressResponse = await utils.GZip([]);
      return response.Error("Mobile number already exists", compressResponse);
    }

    if (_id) {
      const existingUser = await User.findById(_id);
      if (!existingUser) {
        compressResponse = await utils.GZip([]);
        return response.Error("User not found", compressResponse);
      }
      let updatedData = await User.findByIdAndUpdate(_id, req.body, { new: true });
      compressResponse = await utils.GZip([updatedData]);
      
      return response.Success("Admin/trainer Updated Successfully", compressResponse);
    } else {
      const newPassword = generateRandomPassword(8);
      const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));

      const newUser = new User({
        ...req.body,
        password: hashedPassword,
        passwordPlain: newPassword,
        userRefId: addedBy
      });
     let addedUser =  await newUser.save();
     compressResponse = await utils.GZip([addedUser]);
     if(addedUser){
      const to = addedUser.email;
      const subject = 'CSC Agent Training';
      const text = '';
      const html = await templates.accountDetails(addedUser.email,newPassword,addedUser.firstName,"http://45.250.3.34/" )
      await mailer.sendMail(to, subject, text, html);
      console.log('Email sent successfully');

     }

      return response.Success("Admin/Trainer Added Successfully", compressResponse, { password: newPassword });
    }
  } catch (err) {
    console.error("Error in addUpdateAdminOrTrainer:", err);
    return response.Error("Server error", []);
  }
};


const addUpdateSupervisor = async (req, res) => {
  const response = new ResponseHandler(res);
  const { generateRandomPassword } = new CommonMethods();
  const mailer = new Mailer();
  const utils = new CommonMethods();
  try {
    const { userId: addedBy } = req.user; 
    const { _id, email, mobile,adminId } = req.body;
    let compressResponse;

    console.log(req.body);

    const [isEmailExist, isMobileExist] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ mobile })
    ]);

    if (isEmailExist) {
      compressResponse = await utils.GZip([]);
      return response.Error("Email already exists", compressResponse);
    }
    if (isMobileExist) {
      compressResponse = await utils.GZip([]);
      return response.Error("Mobile number already exists", compressResponse);
    }

    if (_id) {
      const existingUser = await User.findById(_id);
      if (!existingUser) {
        compressResponse = await utils.GZip([]);
        return response.Error("User not found", compressResponse);
      }
      let updatedData = await User.findByIdAndUpdate(_id, { ...req.body, adminId }, { new: true });
      compressResponse = await utils.GZip([updatedData]);

      return response.Success("Supervisor Updated Successfully", compressResponse);
    } else {
      const newPassword = generateRandomPassword(8);
      const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));

      const newUser = new User({
        ...req.body,
        password: hashedPassword,
        passwordPlain: newPassword,
        userRefId: addedBy,
        adminId,
      });

      let addedUser = await newUser.save();
      compressResponse = await utils.GZip([addedUser]);

      if (addedUser) {
        const to = addedUser.email;
        const subject = 'CSC Agent Training';
        const text = '';
        const html = await templates.accountDetails(addedUser.email, newPassword, addedUser.firstName, "http://45.250.3.34/" );
        await mailer.sendMail(to, subject, text, html);
        console.log('Email sent successfully');
      }

      return response.Success("Supervisor Added Successfully", compressResponse, { password: newPassword });
    }
  } catch (err) {
    console.error("Error in addUpdateAdminOrTrainer:", err);
    return response.Error("Server error", []);
  }
};







// const agentList = async (req, res) => {
//   const response = new ResponseHandler(res);
//   const utils = new CommonMethods();
//   try {
//     const { page = 1, limit = 10, searchQuery = '', role, adminId, supervisorId } = req.body;
//     if(!role){
//       return response.Error("Role is required", [])
//     }
//     const validRoles = [0, 1, 2, 3];
//     if (!validRoles.includes(parseInt(role))) {
//       return response.Error("Please enter a valid role", []);
//     }
//     let searchCondition = { status: 0 }; 
    
//     if (role) {
//       searchCondition.role = role;
//     }

//     if (searchQuery) {
//       searchCondition.$or = [
//         { firstName: { $regex: searchQuery, $options: 'i' } },
//         { lastName: { $regex: searchQuery, $options: 'i' } },
//         { userName: { $regex: searchQuery, $options: 'i' } },
//       ];
//     }

//     let query = [
//       { $match: searchCondition },
//       { 
//         $sort: { 
//           createdAt: -1, 
//           email: 1,       
//           mobile: 1,      
//           userName: 1 
//         }
//       },
//       {
//         $lookup: {
//           from: 'regions',  
//           localField: 'region',  
//           foreignField: '_id',  
//           as: 'region', 
//         }
//       },
//       {
//         $unwind: {
//           path: '$region',
//           preserveNullAndEmptyArrays: true,
//         }
//       },
//       {
//         $lookup: {
//           from: 'states',  
//           localField: 'state',  
//           foreignField: '_id',  
//           as: 'state', 
//         }
//       },
//       {
//         $unwind: {
//           path: '$state',
//           preserveNullAndEmptyArrays: true,
//         }
//       },
//       {
//         $lookup: {
//           from: 'cities',  
//           localField: 'city',  
//           foreignField: '_id',  
//           as: 'city', 
//         }
//       },
//       {
//         $unwind: {
//           path: '$city',
//           preserveNullAndEmptyArrays: true,
//         }
//       },
//       {
//         $project: {
//           firstName: 1,
//           lastName: 1,
//           email: 1,
//           mobile: 1,
//           designation: 1,
//           region: {
//             name: "$region.name",
//             _id: "$region._id",
//           },
//           state: {
//             name: "$state.name",
//             _id: "$state._id",
//             code: "$state.stateCode"
//           },
//           city: {
//             name: "$city.name",
//             _id: "$city._id",
//             code: "$city.cityCode"
//           },
//           userName: 1,
//           role: 1
//         }
//       }
//     ];

//     const options = {
//       page,
//       limit,
//       customLabels: { totalDocs: 'total', docs: 'agents' },
//     };

//     const myAggregate = User.aggregate(query);
//     const getData = await User.aggregatePaginate(myAggregate, options);

//     if (getData && getData.agents.length > 0) {
//       const compressResponse = await utils.GZip(getData);
//       response.Success(responseElement.AGENTFETCHED, compressResponse);
//     } else {
//       response.Success(responseElement.NO_AGENTS_FOUND, []);
//     }

//   } catch (err) {
//     return response.Error(responseElement.INTERNAL_ERROR, err.message);
//   }
// };


const agentListWorking = async (req, res) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();
  try {
    const { page = 1, limit = 10, searchQuery = '', role, adminId, supervisorId } = req.body;
    console.log(req.body, "tes")
    if (!role) {
      return response.Error("Role is required", []);
    }

    const validRoles = [0, 1, 2, 3];
    if (!validRoles.includes(parseInt(role))) {
      return response.Error("Please enter a valid role", []);
    }

    let searchCondition = { status: 0 };

    if (role) {
      searchCondition.role = role;
    }

    
    if (adminId) {
      searchCondition.adminId = mongoose.Types.ObjectId(adminId);
    }

    
    if (supervisorId) {
      searchCondition.supervisorId = mongoose.Types.ObjectId(supervisorId);
    }

    if (searchQuery) {
      searchCondition.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { userName: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    console.log(searchCondition, "searchQuery")
    let query = [
      { $match: searchCondition },
      { 
        $sort: { 
          createdAt: -1, 
          email: 1,       
          mobile: 1,      
          userName: 1 ,
          status:1
        }
      },
      {
        $lookup: {
          from: 'regions',
          localField: 'region',
          foreignField: '_id',
          as: 'region',
        }
      },
      {
        $unwind: {
          path: '$region',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup: {
          from: 'states',
          localField: 'state',
          foreignField: '_id',
          as: 'state',
        }
      },
      {
        $unwind: {
          path: '$state',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'city',
          foreignField: '_id',
          as: 'city',
        }
      },
      {
        $unwind: {
          path: '$city',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          mobile: 1,
          designation: 1,
          status:1,
          region: {
            name: "$region.name",
            _id: "$region._id",
          },
          state: {
            name: "$state.name",
            _id: "$state._id",
            code: "$state.stateCode"
          },
          city: {
            name: "$city.name",
            _id: "$city._id",
            code: "$city.cityCode"
          },
          userName: 1,
          role: 1
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
    return response.Error(responseElement.INTERNAL_ERROR, err.message);
  }
};

// const agentList = async (req, res) => {
//   const response = new ResponseHandler(res);
//   const utils = new CommonMethods();
//   try {
//      let currentUser = await User.findOne({_id:req.user.userId});
     
//     const { page = 1, limit = 10, searchQuery = '', role, adminId, supervisorId } = req.body;
//     if (!role) {
//       return response.Error("Role is required", []);
//     }

//     const validRoles = [0, 1, 2, 3];
//     if (!validRoles.includes(parseInt(role))) {
//       return response.Error("Please enter a valid role", []);
//     }

//     let searchCondition = { status: { $in: [0, 1] } };


//     if (role) {
//       searchCondition.role = role;
//     }

//     if (adminId) {
//       searchCondition.adminId = mongoose.Types.ObjectId(adminId);
//     }

//     if (supervisorId) {
//       searchCondition.supervisorId = mongoose.Types.ObjectId(supervisorId);
//     }

//     if (searchQuery) {
//       searchCondition.$or = [
//         { firstName: { $regex: searchQuery, $options: 'i' } },
//         { lastName: { $regex: searchQuery, $options: 'i' } },
//         { userName: { $regex: searchQuery, $options: 'i' } },
//       ];
//     }

//     console.log(searchCondition, "searchQuery");
//     let query = [
//       { $match: searchCondition },
//       { 
//         $sort: { 
//           createdAt: -1, 
//           email: 1,       
//           mobile: 1,      
//           userName: 1 ,
//           status: 1
//         }
//       },
//       {
//         $lookup: {
//           from: 'regions',
//           localField: 'region',
//           foreignField: '_id',
//           as: 'region',
//         }
//       },
//       {
//         $unwind: {
//           path: '$region',
//           preserveNullAndEmptyArrays: true,
//         }
//       },
//       {
//         $lookup: {
//           from: 'states',
//           localField: 'state',
//           foreignField: '_id',
//           as: 'state',
//         }
//       },
//       {
//         $unwind: {
//           path: '$state',
//           preserveNullAndEmptyArrays: true,
//         }
//       },
//       {
//         $lookup: {
//           from: 'cities',
//           localField: 'city',
//           foreignField: '_id',
//           as: 'city',
//         }
//       },
//       {
//         $unwind: {
//           path: '$city',
//           preserveNullAndEmptyArrays: true,
//         }
//       },
//       {
//         $project: {
//           firstName: 1,
//           lastName: 1,
//           email: 1,
//           mobile: 1,
//           designation: 1,
//           status: 1,  // Ensure the status field is included
//           region: {
//             name: "$region.name",
//             _id: "$region._id",
//           },
//           state: {
//             name: "$state.name",
//             _id: "$state._id",
//             code: "$state.stateCode"
//           },
//           city: {
//             name: "$city.name",
//             _id: "$city._id",
//             code: "$city.cityCode"
//           },
//           userName: 1,
//           role: 1
//         }
//       }
//     ];

//     const options = {
//       page,
//       limit,
//       customLabels: { totalDocs: 'total', docs: 'agents' },
//     };

//     const myAggregate = User.aggregate(query);
//     const getData = await User.aggregatePaginate(myAggregate, options);

//     if (getData && getData.agents.length > 0) {
//       const compressResponse = await utils.GZip(getData);
//       response.Success(responseElement.AGENTFETCHED, compressResponse);
//     } else {
//       response.Success(responseElement.NO_AGENTS_FOUND, []);
//     }

//   } catch (err) {
//     return response.Error(responseElement.INTERNAL_ERROR, err.message);
//   }
// };


const agentList = async (req, res) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();
  try {
    // Fetch current user
    let currentUser = await User.findOne({ _id: req.user.userId });

    // If user is not found, return a specific error message
    if (!currentUser) {
      return response.Error("User not found. Please ensure you are logged in with a valid user.", []);
    }

    const { page = 1, limit = 10, searchQuery = '', role, adminId, supervisorId } = req.body;
    console.log(req.body);

    // Validate 'role' field
    if (!role) {
      return response.Error("Role is required. Please provide a valid role.", []);
    }

    // Validate that the provided role is valid
    const validRoles = [0, 1, 2, 3];
    if (!validRoles.includes(parseInt(role))) {
      return response.Error("Invalid role provided. Please provide a valid role (0, 1, 2, or 3).", []);
    }

    // Default search condition (active users)
    let searchCondition = { status: { $in: [0, 1] } };

    // Construct search conditions based on the role and user permissions
    if (currentUser.role === 1) {
      searchCondition.adminId = mongoose.Types.ObjectId(currentUser._id);
      searchCondition.role = role;
    } else if (currentUser.role === 0) {
      if (role) {
        searchCondition.role = role;
      }

      if (adminId) {
        searchCondition.adminId = mongoose.Types.ObjectId(adminId);
      }

      if (supervisorId) {
        searchCondition.supervisorId = mongoose.Types.ObjectId(supervisorId);
      }
    } else {
      searchCondition.adminId = mongoose.Types.ObjectId(currentUser.adminId);
      searchCondition.role = role;
      searchCondition.supervisorId = mongoose.Types.ObjectId(currentUser._id);
    }

    // If there's a search query, update the search condition
    if (searchQuery) {
      searchCondition.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { userName: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    console.log("Search condition:", searchCondition);

    // Aggregate query to retrieve users and their associated region, state, city
    let query = [
      { $match: searchCondition },
      {
        $sort: {
          createdAt: -1,
          email: 1,
          mobile: 1,
          userName: 1,
          status: 1,
        }
      },
      {
        $lookup: {
          from: 'regions',
          localField: 'region',
          foreignField: '_id',
          as: 'region',
        }
      },
      {
        $unwind: { path: '$region', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'states',
          localField: 'state',
          foreignField: '_id',
          as: 'state',
        }
      },
      {
        $unwind: { path: '$state', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'city',
          foreignField: '_id',
          as: 'city',
        }
      },
      {
        $unwind: { path: '$city', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          mobile: 1,
          designation: 1,
          status: 1,
          region: { name: "$region.name", _id: "$region._id" },
          state: { name: "$state.name", _id: "$state._id", code: "$state.stateCode" },
          city: { name: "$city.name", _id: "$city._id", code: "$city.cityCode" },
          userName: 1,
          role: 1,
        }
      }
    ];

    // Pagination options
    const options = {
      page,
      limit,
      customLabels: { totalDocs: 'total', docs: 'agents' },
    };

    // Aggregate and paginate results
    const myAggregate = User.aggregate(query);
    const getData = await User.aggregatePaginate(myAggregate, options);

    // Handle no agents found scenario
    if (getData && getData.agents.length > 0) {
      const compressResponse = await utils.GZip(getData);
      response.Success(responseElement.AGENTFETCHED, compressResponse);
    } else {
      response.Success(responseElement.NO_AGENTS_FOUND, []);
    }

  } catch (err) {
    // Log detailed error information for internal debugging
    console.error('Error during agent list fetch:', err);

    // Provide a specific error message and consider user-friendly messaging
    if (err.name === 'ValidationError') {
      return response.Error('Validation error occurred. Please ensure that all required fields are properly filled.', err.message);
    } else if (err.name === 'MongoError') {
      return response.Error('Database error occurred while fetching agents. Please try again later.', err.message);
    } else {
      return response.Error('Internal server error. Please contact support if the issue persists.', err.message);
    }
  }
};







const disableAgent = async (req, res) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();

  try {
    const { agentId, status } = req.body;

    const responseData = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(agentId) },
      { $set: { status: status } },
      { new: true }
    );

    switch (responseData?.status) {
      case 1:
        return response.Success(responseElement.AGENTDISABLE, []);
      case 0:
        return response.Success(responseElement.AGENTENABLE, []);
      case 2:
        return response.Success(responseElement.AGENTINACTIVE, []);
      case 4:
        return response.Success(responseElement.AGENTBLOCKED, []);
      default:
        return response.Error("Error in Disable", []);
    }
  } catch (err) {
    console.log(err);
    return response.Error("Server Error", []);
  }
};



// const getUserById = async(req, res) => {
//   const response = new ResponseHandler(res);
//   const utils = new CommonMethods();
//   let compressResponse;
//   try {
//     if(!req.body.userId){
//       compressResponse = await utils.GZip([]);
//       return response.Error("Enter the userId", compressResponse);
//     }

//     let { userId } = req.body;

//     let userInfo = await User.aggregate([
//       {
//         $match: {
//           _id: mongoose.Types.ObjectId(userId)
//         }
//       },
//       {
//         $facet: {
//           user: [
//             {
//               $project: {
//                 firstName: 1,
//                 lastName: 1,
//                 email: 1,
//                 mobile: 1,
//                 designation: 1,
//                 status: 1,
//                 uniqueUserName: 1,
//                 assignedProfile:1
//               }
//             }
//           ],
//           country: [
//             {
//               $lookup: {
//                 from: "countries",
//                 localField: "country",
//                 foreignField: "_id",
//                 as: "country"
//               }
//             },
//             {
//               $unwind: {
//                 path: "$country",
//                 preserveNullAndEmptyArrays: true
//               }
//             },
//             {
//               $project: {
//                 _id: "$country._id",
//                 name: "$country.name"
//               }
//             }
//           ],
//           state: [
//             {
//               $lookup: {
//                 from: "states",
//                 localField: "state",
//                 foreignField: "_id",
//                 as: "state"
//               }
//             },
//             {
//               $unwind: {
//                 path: "$state",
//                 preserveNullAndEmptyArrays: true
//               }
//             },
//             {
//               $project: {
//                 _id: "$state._id",
//                 name: "$state.name"
//               }
//             }
//           ],
//           city: [
//             {
//               $lookup: {
//                 from: "cities",
//                 localField: "city",
//                 foreignField: "_id",
//                 as: "city"
//               }
//             },
//             {
//               $unwind: {
//                 path: "$city",
//                 preserveNullAndEmptyArrays: true
//               }
//             },
//             {
//               $project: {
//                 _id: "$city._id",
//                 name: "$city.name"
//               }
//             }
//           ]
//         }
//       },
//       {
//         $project: {
//           firstName: { $arrayElemAt: ["$user.firstName", 0] },
//           lastName: { $arrayElemAt: ["$user.lastName", 0] },
//           email: { $arrayElemAt: ["$user.email", 0] },
//           mobile: { $arrayElemAt: ["$user.mobile", 0] },
//           designation: { $arrayElemAt: ["$user.designation", 0] },
//           status: { $arrayElemAt: ["$user.status", 0] },
//           uniqueUserName: { $arrayElemAt: ["$user.uniqueUserName", 0] },
//           country: { $arrayElemAt: ["$country", 0] },
//           state: { $arrayElemAt: ["$state", 0] },
//           city: { $arrayElemAt: ["$city", 0] },
//           assignedProfile: { $arrayElemAt: ["$user.assignedProfile",0]}
//         }
//       },
//       {
//         $lookup:{
//           from: "profiles",
//           localField: "assignedProfile",
//           foreignField: "_id",
//           as: "assignedProfile"
//         }
//       },
//       {
//         $unwind: {
//           path: "$assignedProfile",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $lookup: {
//           from: "menus",
//           localField: "assignedProfile.menuPermission",
//           foreignField: "_id", 
//           as: "assignedProfile.menuPermission", 
//         },
//       },
//       {
//         $unwind: {
//           path: "$assignedProfile.menuPermission",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "submenus", // Perform the lookup on submenus collection
//           localField: "assignedProfile.menuPermission.submenus", // Use the submenus array in menuPermission
//           foreignField: "_id", // Match with the submenu _id in the submenus collection
//           as: "assignedProfile.menuPermission.submenus", // Add the submenu details as submenusDetails
//         },
//       },
      
//     ]);

//     if (userInfo.length === 0) {
//       compressResponse = await utils.GZip([]);
//       return response.Success("No Record Found", compressResponse);
//     }

//     compressResponse = await utils.GZip(userInfo);
//     return response.Success("User found", userInfo);
//   } catch (err) {
//     return response.Error(responseElement.SERVERERROR, []);
//   }
// }

const getUserById = async (req, res) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();
  let compressResponse;
  try {
    if (!req.body.userId) {
      compressResponse = await utils.GZip([]);
      return response.Error("Enter the userId", compressResponse);
    }

    let { userId } = req.body;

    let userInfo = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $facet: {
          user: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                mobile: 1,
                designation: 1,
                status: 1,
                userName: 1,
                assignedProfile: 1,
                gender:1,
                dob:1,
                qualification:1,
                experience:1,
                location:1,
                status:1,
                adminId:1,
                supervisorId:1

              },
            },
          ],
          country: [
            {
              $lookup: {
                from: "regions",
                localField: "region",
                foreignField: "_id",
                as: "region",
              },
            },
            {
              $unwind: {
                path: "$region",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: "$region._id",
                name: "$region.name",
              },
            },
          ],
          state: [
            {
              $lookup: {
                from: "states",
                localField: "state",
                foreignField: "_id",
                as: "state",
              },
            },
            {
              $unwind: {
                path: "$state",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: "$state._id",
                name: "$state.name",
              },
            },
          ],
          city: [
            {
              $lookup: {
                from: "cities",
                localField: "city",
                foreignField: "_id",
                as: "city",
              },
            },
            {
              $unwind: {
                path: "$city",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: "$city._id",
                name: "$city.name",
              },
            },
          ],
        },
      },
      {
        $project: {
          firstName: { $arrayElemAt: ["$user.firstName", 0] },
          lastName: { $arrayElemAt: ["$user.lastName", 0] },
          email: { $arrayElemAt: ["$user.email", 0] },
          mobile: { $arrayElemAt: ["$user.mobile", 0] },
          designation: { $arrayElemAt: ["$user.designation", 0] },
          status: { $arrayElemAt: ["$user.status", 0] },
          userName: { $arrayElemAt: ["$user.userName", 0] },
          country: { $arrayElemAt: ["$country", 0] },
          state: { $arrayElemAt: ["$state", 0] },
          city: { $arrayElemAt: ["$city", 0] },
          assignedProfile: { $arrayElemAt: ["$user.assignedProfile", 0] },
          gender:{ $arrayElemAt: ["$user.gender", 0] },
          dob:{ $arrayElemAt: ["$user.dob", 0] },
          qualification:{ $arrayElemAt: ["$user.qualification", 0] },
          experience:{ $arrayElemAt: ["$user.experience", 0] },
          location:{ $arrayElemAt: ["$user.location", 0] },
          status:{ $arrayElemAt: ["$user.status", 0] },
          adminId:{ $arrayElemAt: ["$user.adminId", 0] },
                supervisorId:{ $arrayElemAt: ["$user.supervisorId", 0] },
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "assignedProfile",
          foreignField: "_id",
          as: "assignedProfile",
        },
      },
      {
        $unwind: {
          path: "$assignedProfile",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "menus",
          localField: "assignedProfile.menuPermission", 
          foreignField: "_id", 
          as: "assignedProfile.menuPermission",
        },
      },
     {
      $project:{
        firstName: 1,
        lastName:1,
        email:1,
        mobile: 1,
        designation:1,
        status:1,
        userName:1,
        country:1,
        state: 1,
        city: 1,
        assignedProfile: 1,
        gender:1,
        dob:1,
        qualification:1,
        experience:1,
        location:1,
        status:1,
        adminId:1,
        supervisorId:1
      }
     }
       
     
    ]);

    if (userInfo.length === 0) {
      compressResponse = await utils.GZip([]);
      return response.Success("No Record Found", compressResponse);
    }

    compressResponse = await utils.GZip(userInfo);
    return response.Success("User found", compressResponse);
  } catch (err) {
    return response.Error(responseElement.SERVERERROR, []);
  }
};

const statusUpdate = async (req, res) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();
  try {
    let { agentId, status } = req.body;

    if (!agentId) {
      return response.Error("User Id is required", []);
    }
    if (!status) {
      return response.Error("Status is required", []);
    }

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return response.Error("Invalid User Id", []);
    }
    let updatedUser = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(agentId) },
      { $set: { status } },
      { new: true } 
    );

    if (updatedUser) {
      const compressResponse = await utils.GZip(updatedUser);
      
      if (compressResponse) {
        return response.Success("Status updated successfully", compressResponse);
      } else {
        return response.Error("Compression failed", []);
      }
    } else {
      return response.Error("No user found with the given UserId", []);
    }

  } catch (err) {
    console.error("Error updating status:", err); 
    return response.Error(responseElement.SERVERERROR, []);
  }
};















module.exports = { createAgent,updateAgent,agentList,disableAgent, getUserById,addUpdateAdminOrTrainer,addUpdateSupervisor,statusUpdate};
