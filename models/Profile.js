const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  profileName: {
    type: String,
    required: true,
    trim: true,
  },
  profileDescription: {
    type: String,
    required: true,
    trim: true,
  },
  insertDateTime: {
    type: Date,
    default: Date.now,
  },
  updateDateTime: {
    type: Date,
    default: null,
  },
  insertIPAddress: {
    type: String,
    required: true,
  },
  activeStatus: {
    type: Boolean,
    default: true,  // Default status is active
  },
  menuPermission: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',  // Assuming you have a 'Menu' model
    required: true,
  }],
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
