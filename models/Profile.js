const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); // Assuming you are using this plugin
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
profileSchema.plugin(aggregatePaginate);
const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
