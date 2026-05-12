const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // 1. Check if the password matches the one in your Vercel Environment Variables
    if (email === process.env.ADMIN_MAIL && password === process.env.ADMIN_PASSWORD) {
        
        // 2. Create a token that expires in 24 hours
        const token = jwt.sign(
            { id: 'admin_primary' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            token: token
        });
    }

    // 3. If password fails
    return res.status(401).json({
        success: false,
        message: 'Invalid Admin Email or Password'
    });
});

module.exports = router;