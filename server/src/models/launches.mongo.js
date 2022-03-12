const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: [true, 'Please provide a flight number.'],
    unique: true,
  },
  mission: {
    type: String,
    required: [true, 'Please provide a mission'],
  },
  rocket: {
    type: String,
    required: [true, 'Please provide a rocket'],
  },
  launchDate: {
    type: Date,
    required: [true, 'Please provide a launchDate'],
  },
  target: {
    type: String,
    required: [true, 'Please provide a target'],
  },
  customers: {
    type: [String],
    required: true,
    default: ['ZTM', 'NASA'],
  },
  upcoming: {
    type: Boolean,
    required: true,
    default: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Launch = mongoose.model('Launch', launchesSchema);
module.exports = Launch;
