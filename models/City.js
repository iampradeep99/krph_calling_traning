const mongoose = require('mongoose');

// Import the State model
const State = require('./State');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cityCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true, // Store city code in uppercase (e.g., "LA" for Los Angeles)
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State', // Reference to the State model
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

const City = mongoose.model('City', citySchema);

module.exports = City;
