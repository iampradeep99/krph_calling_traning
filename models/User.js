const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,  
    trim: true,
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country', 
    required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City', 
    required: true,
  },
  privilegeType: {
    type: Number,
    // required: true,
    enum: [0,1,2,3],
    default:3
    /* 
    0 = Super Admin,
    1 = Admin,
    2 = Agent,
    3 = Trainer,
    */
  },
  username: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  insertDateTime: {
    type: Date,
    default: Date.now,
  },
  updateDateTime: {
    type: Date,
    default: null,
  },
  token:{
    type:String
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
