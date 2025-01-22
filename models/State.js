const mongoose = require('mongoose');

// Import the Country model
const Country = require('./Country');

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  stateCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true, // Store state code in uppercase (e.g., "CA" for California)
  },
  regionCode: [{
    type: mongoose.Types.ObjectId,
    ref: "Region", 
  }],
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country', 
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
}, { timestamps: true });

const State = mongoose.model('State', stateSchema);

module.exports = State;
