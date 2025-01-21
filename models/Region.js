const mongoose = require('mongoose');

// Define the region schema
const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['East', 'West', 'North', 'South', 'Central', 'South-East'],
    unique: true, // Ensure each region is unique
  },
  regionCode: {
    type: String,
    required: true, 
    unique: true, 
  },
  active: {
    type: Boolean,
    default: true, 
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
  timestamps: true, 
});

regionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Region = mongoose.model('Region', regionSchema);

module.exports = Region;
