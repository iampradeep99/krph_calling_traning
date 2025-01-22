const User = require('../models/User');
const ResponseHandler = require('../constant/common');
const CommonMethods = require("../utils/utilities");
const bcrypt = require('bcryptjs');
const responseElement = require('../constant/constantElements')
const mongoose = require('mongoose');
const { request } = require('../app');
const STATE = require('../models/State');
const { assignProfile } = require('./profile');


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
    const { firstName, lastName, email, mobile, designation, role, region, state, city, gender, dob, qualification, experience, location, refId } = req.body;
    const utils = new CommonMethods(firstName, 8);
    let compressResponse;
    const userName = utils.generateRandomAlphanumeric();
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

    let newPassword = utils.generateRandomPassword(8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
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
      userName,
      role: role,
      userRefId: refId,
      passwordPlain:newPassword
    });

    let savedInfo = await agent.save();

    const agentResponse = {
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      mobile: agent.mobile,
      designation: agent.designation,
      country: agent.country,
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
    compressResponse = await utils.GZip(agentResponse);
    return response.Success(responseElement.AGENTADD, compressResponse);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, could not create agent' });
  }
};



const updateAgent = async (req, res) => {
  const response = new ResponseHandler(res);
  const { agentId, firstName, lastName, email, mobile, password, designation, country, state, city, gender, dob, qualification, experience, location, assignedProfile } = req.body;
  const utils = new CommonMethods(firstName, 8);
  let compressResponse;

  try {
    const agent = await User.findById(agentId);
    if (!agent) {
      compressResponse = await utils.GZip([]);
      return response.Success("Agent not found", compressResponse);
    }

    if (email && email !== agent.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        compressResponse = await utils.GZip([]);
        return response.Success("Email is already registered", compressResponse);
      }
    }

    // Check if mobile is being changed and if it's already registered
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

    // Update agent information with provided fields or keep existing ones
    agent.firstName = firstName || agent.firstName;
    agent.lastName = lastName || agent.lastName;
    agent.email = email || agent.email;  // Email is only updated if a new one is provided
    agent.mobile = mobile || agent.mobile;
    agent.designation = designation || agent.designation;
    agent.country = country || agent.country;
    agent.state = state || agent.state;
    agent.city = city || agent.city;
    agent.gender = gender || agent.gender;
    agent.dob = dob || agent.dob;
    agent.qualification = qualification || agent.qualification;
    agent.experience = experience || agent.experience;
    agent.location = location || agent.location;
    agent.assignedProfile = assignedProfile || agent.assignedProfile;

    let savedInfo = await agent.save();

    const agentResponse = {
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      mobile: agent.mobile,
      designation: agent.designation,
      country: agent.country,
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
    compressResponse = await utils.GZip([]);
    return response.Error('Server error, could not update agent', compressResponse);
  }
};




const agentList = async (req, res) => {
  const response = new ResponseHandler(res);
  const utils = new CommonMethods();
  try {
    const { page = 1, limit = 10, searchQuery = '', role } = req.body;
    if(!role){
      return response.Error("Role is required", [])
    }
    const validRoles = [0, 1, 2, 3];
    if (!validRoles.includes(parseInt(role))) {
      return response.Error("Please enter a valid role", []);
    }
    let searchCondition = { status: 0 }; 
    
    if (role) {
      searchCondition.role = role;
    }

    if (searchQuery) {
      searchCondition.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { uniqueUserName: { $regex: searchQuery, $options: 'i' } },
      ];
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
      },
      {
        $lookup: {
          from: 'countries',  
          localField: 'country',  
          foreignField: '_id',  
          as: 'country', 
        }
      },
      {
        $unwind: {
          path: '$country',
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
          country: {
            name: "$country.name",
            _id: "$country._id",
            code: "$country.countryCode"
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
          uniqueUserName: 1,
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
                uniqueUserName: 1,
                assignedProfile: 1,
              },
            },
          ],
          country: [
            {
              $lookup: {
                from: "countries",
                localField: "country",
                foreignField: "_id",
                as: "country",
              },
            },
            {
              $unwind: {
                path: "$country",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: "$country._id",
                name: "$country.name",
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
          uniqueUserName: { $arrayElemAt: ["$user.uniqueUserName", 0] },
          country: { $arrayElemAt: ["$country", 0] },
          state: { $arrayElemAt: ["$state", 0] },
          city: { $arrayElemAt: ["$city", 0] },
          assignedProfile: { $arrayElemAt: ["$user.assignedProfile", 0] },
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
        uniqueUserName:1,
        country:1,
        state: 1,
        city: 1,
        assignedProfile: 1,
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














module.exports = { createAgent,updateAgent,agentList,disableAgent, getUserById};
