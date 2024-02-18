const express = require('express');
const jwt = require('jsonwebtoken');
const { generateJwtToken } = require('./utils');
const router = express.Router();
const db = require('../database/database');
const bcrypt = require('bcrypt'); // For password comparison (assuming secure hashing elsewhere)

router.post('/login', async (req, res) => {
  const { user_id, user_password } = req.body;

  try {
    // Retrieve user using username/email
    const user = await db.UserCred.findOne({ where: { user_id: user_id } });

    if (!user) {
      throw new Error('Invalid username or password'); // Or a more descriptive error message
    }

    // Compare provided password with stored hash (securely implemented elsewhere)
    const passwordMatch = await bcrypt.compare(user_password, user.user_password);

    if (!passwordMatch) {
      throw new Error('Invalid username or password'); // Or a more informative error message
    }

    // Generate JWT token securely
    const token = generateJwtToken(user); // Replace with your secure JWT generation logic

    res.json({ token });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(401).json({ message: 'Invalid credentials' }); // Or a more informative error message
  }
});

module.exports = router;
