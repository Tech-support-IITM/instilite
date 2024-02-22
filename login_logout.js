const express = require('express');
const jwt = require('jsonwebtoken');
const { generateJwtToken } = require('./utils');
const db = require('./database');
const bodyParser = require('body-parser');
const PORT = 3000;
const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} `);
});

app.post('/login', async (req, res) => {                //login api
  const { user_id, user_password } = req.query;

  try {
    // Retrieve user using username/email
    const query = 'SELECT * FROM usercreds WHERE user_id = ? AND user_password = ?';
    db.query(query, [user_id, user_password], async (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        throw new Error('Invalid username or password');
      }

      const user = results[0];

      // Generate JWT token securely
      const token = generateJwtToken(user);

      res.json({ token });
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
module.exports = app;

app.post('/logout', (req, res) => {

  const user_id = null; 
  // localStorage.removeItem('token');


  res.json({ message: 'Logout successful' });
});

app.get('/userget', (req, res)=>{
    res.send("working");
});





