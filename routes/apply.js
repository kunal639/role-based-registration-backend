const express = require('express');
const router = express.Router();
const { Founder, Audience } = require('../models/UserModels');
const sanitize = require('mongo-sanitize')
const sendEmail = require('../utils/email');


router.post('/', async (req, res) => {
  try {
    const cleanBody = sanitize(req.body);
    const { role, ...details } = cleanBody;

    let newUser;
    if (role === 'founder') {
      newUser = new Founder(details);
    } else if (role === 'audience') {
      newUser = new Audience(details);
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Save to MongoDB
    await newUser.save();

    // Trigger Brevo Email 
    try {
      await sendEmail(details.email, details.name, role, details); 
    }
    catch (emailError) {
      console.error("📧 Email Service Error:", emailError.message);
      // We don't tell the user the email failed yet, or we give a subtle warning
    }

    res.status(200).json({ message: "Registration successful! Welcome to the event." });  
  
  } catch (error) {
    // Handling Duplicate Email Error (MongoDB code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: "This email is already registered." });
    }
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;