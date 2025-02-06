// backend/models/CrushForm.js
const mongoose = require('mongoose');

const crushFormSchema = new mongoose.Schema({
  crushName: { type: String, required: true },
  userEmail: { type: String, required: true },
  yesResponse: { type: String, required: true },
  noResponse: { type: String, required: true },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
});

module.exports = mongoose.model('CrushForm', crushFormSchema);