const mongoose = require('mongoose');

const profileAssignSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profile',
        required: true
    },
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',
        required: true
    }],
    insertDateTime: {
        type: Date,
        default: Date.now,
      },
      updateDateTime: {
        type: Date,
        default: null,
      },
}, { timestamps: true });

const ProfileAssign = mongoose.model('ProfileAssign', profileAssignSchema);

module.exports = ProfileAssign;
