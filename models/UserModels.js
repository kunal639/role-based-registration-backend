const mongoose = require('mongoose');

const FounderSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'] 
  },
  startup: { type: String, required: true },
  idea: { type: String, required: true },
  stage: { type: String, required: true },
  org: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
});

const AudienceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  org: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = {
  Founder: mongoose.model('Founder', FounderSchema),
  Audience: mongoose.model('Audience', AudienceSchema)
};