const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const autoIncrement = require('mongoose-auto-increment');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

// Initialize mongoose connection and auto-increment plugin
autoIncrement.initialize(mongoose.connection);

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
    enum: [0, 1, 2, 3],
    default: 3, // Default is Trainer
  },
  username: {
    type: String,
    trim: true,
  },
  userNameDigit: {
    type: String, 
    unique: true,
    get: function(value) {
      return value.padStart(4, '0');
    },
  },
  uniqueUserName:{
    type: String,
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
  token: {
    type: String,
  },
  status:{
    type:Number,
    enum: [0, 1, 2, 3],
    default: 0, 
    /* 
    0 = Enable,
    1 = Disable,
    2 = Inactive,
    3 = Blocked,
    */
  },
  menuPermission: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
}]
}, { timestamps: true });

// Apply the auto-increment plugin to the userNameDigit field
userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'userNameDigit',
  startAt: 1,  // Start from 1
  incrementBy: 1,  // Increment by 1
});

userSchema.plugin(aggregatePaginate)
const User = mongoose.model('User', userSchema);

module.exports = User;
