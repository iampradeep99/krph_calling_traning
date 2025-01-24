const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const autoIncrement = require('mongoose-auto-increment');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

autoIncrement.initialize(mongoose.connection);

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    
  },
  lastName: {
    type: String,
    
  },
  email: {
    type: String,
    
    
  },
  mobile: {
    type: String,  
  },
  designation: {
    type: String,
    
  },
  region:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Region"
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  gender: {
    type: Number,  
    required: false,
    enum: [0,1,2],
    /* 0 = Male, 1 = Female, 2 = Others */
  },
  dob: {
    type: Date,  
    required: false,
  },
  qualification: {
  type:mongoose.Schema.Types.ObjectId,
  ref:"Qualification"
  },
  experience: {
    type: Number, 
    required: false,
  },
  role: {
    type: Number,  // Numeric role identifier
    enum: [0, 1, 2, 3],  // 0 = SuperAdmin, 1 = Trainer/Admin, 2 = Supervisor, 3 = Agent
    default: 3  // Default role is Agent
  },
  userName: {
    type: String,
    trim: true,
  },
 
  agentId: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  passwordPlain:{
    type: String,
  },
  insertDateTime: {
    type: Date,
    default: Date.now,
  },
  updateDateTime: {
    type: Date,
    default: null,
  },
  token: {
    type: String,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 0,
    // 0 = Enable, 1 = Disable, 2 = Inactive, 3 = Blocked
  },
  
  assignedProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
  location: {
    type:String
  },

  userRefId:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
  adminId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  supervisorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
  
}, { timestamps: true });



userSchema.plugin(aggregatePaginate);
const User = mongoose.model('User', userSchema);

module.exports = User;
