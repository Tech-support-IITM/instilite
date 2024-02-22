const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
app.use(bodyParser.json());

app.listen(3001, () => {
  console.log('Server is listening');
});


//personal profile print details !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/readuserprofile', (req, res) => { 
  const user_id = 'ee23b112'; // Specify the user_id here
  const sql = "SELECT * FROM usercreds WHERE user_id = ?";
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
       return res.status(404).json({ error: 'User profile not found' });
    }
    res.status(200).json(results[0]);
  });
});

//add data on signing up !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post('/signup', (req, res) => {
  const { user_id, user_name, user_phone, user_password } = req.query; // Assuming names have changed

  if (!user_id || !user_name || !user_phone || !user_password) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  const userQuery = `
    INSERT INTO usercreds
      (user_id, user_name, user_phone, user_password, user_role, user_access_token)
    VALUES (?, ?, ?, ?, '"student"', '"denied"')
  `;
  const userValues = [user_id, user_name, user_phone, user_password]; // Updated variable names

  db.query(userQuery, userValues, (err, result) => {
    if (err) {
      console.error('Error adding user:', err);
      return res.status(500).json({ error: 'Failed to add user' });
    }
    res.json({ success: true, message: 'User added successfully' });
  });
});


//update personal portfolio!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.post('/updateprofile', (req, res) => {
  // Validate input data
  if (!req.query.user_id || !req.query.new_name || !req.query.new_phone || !req.query.new_password || !req.query.new_linked_in || !req.query.new_desc) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { new_name, new_phone, new_password, new_linked_in, new_desc, user_id } = req.query;

  // Prepare and execute update query using parameterized statement
  const updateQuery = `
    UPDATE usercreds
    SET user_name = ?, user_phone = ?, user_password = ?, linkedin_id = ?, profile_desc = ?
    WHERE user_id = ?
  `;
  const updateValues = [new_name, new_phone, new_password, new_linked_in, new_desc, user_id];

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  });
});
