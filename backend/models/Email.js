const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: String,
  response: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Email', emailSchema); 