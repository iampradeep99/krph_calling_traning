const mongoose = require('mongoose');
const { Schema } = mongoose;

const qualificationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  insertDateTime: {
    type: Date,
    default: Date.now, 
  },
  updateDateTime: {
    type: Date,
    default: Date.now, 
  }
}, {
  timestamps: true // Automatically handles createdAt and updatedAt
});

const Qualification = mongoose.model('Qualification', qualificationSchema);

module.exports = Qualification;
