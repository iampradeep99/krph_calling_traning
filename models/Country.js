const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  countryCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true, // Store country code in uppercase (e.g., "US" for the United States)
    unique: true,
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

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
