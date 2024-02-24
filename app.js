const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const db = require('./database');
const session = require('express-session');
app.use(bodyParser.json());


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
//session creation !!!!!!!!!!!!!!!!!!!!!!!!
app.use(
  session({
    secret: 'i am a little star',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }, // Set the session timeout to 10 minutes (in milliseconds)
  })
);
//login !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post('/login', async (req, res) => {
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
      const user_role = user.user_role;

      // Store user information in the session
      req.session.user = {
        user_id: user.user_id,
        user_name: user.user_name,
        user_role: user_role,
      };
    

      res.json({ message: 'Login successful' });
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to check session expiration !!!!!!!!!!!!!!!!!!!
app.use((req, res, next) => {
  if (req.session.user) {
    // Check if the session has expired
    const now = Date.now();
    const sessionExpirationTime = req.session.cookie.maxAge || 600000; // Default to 10 minutes
    const lastActivityTime = req.session.lastActivity || now;

    if (now - lastActivityTime > sessionExpirationTime) {
      // Session expired, destroy it
      req.session.destroy(() => {
        res.status(401).json({ message: 'Session expired. Please log in again.' });
      });
    } else {
      // Update last activity time
      req.session.lastActivity = now;
      next();
    }
  } else {
    next();
  }
});
app.post('/logout', (req, res) => {
  // Destroy the session on logout
  req.session.destroy(() => {
    res.json({ message: 'Logout successful' });
  });
});


// Endpoint to add events !!!!!!!!!!!!!!!!!!!!!!!!!!
app.post('/pushevents', (req, res) => {
  const { event_name, event_venue, event_desc, event_posted_date, event_start, event_end, event_visibility} = req.query;
  const user_id= req.session.user.user_id;
  // Validate parameters
  if (!event_start || !event_end || !event_name || !event_venue || !event_desc || !event_posted_date || !event_visibility ) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  // Insert event into the database
  const query = `INSERT INTO eventsdetails (event_name, event_venue, event_desc, event_posted_date, user_id, event_date, event_start, event_end, event_visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [event_name, event_venue, event_desc, event_posted_date, user_id , event_start.slice(0, 10), event_start.slice(11),event_end.slice(11),event_visibility]; // Assuming venue and description are optional
  
  db.query(query, values, (err, result) => {                       
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add event' });
    } else {
      res.json({ success: true, message: 'Event added successfully' });
    }
  });
});

// Endpoint to get all events !!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/getevents', (req, res) => {
  const query = 'SELECT * FROM eventsdetails';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch events' });
    } else {
      res.json(results);
    }
  });
});


//personal profile print details !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/readuserprofile', (req, res) => { 
  const user_id = req.session.user.user_id; // Specify the user_id here
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
//personal profile print details !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/readuserprofile', (req, res) => { 
  const user_id = req.session.user.user_id
  const userQuery = `SELECT user_id, user_name, user_phone, linkedin_id, profile_desc FROM usercreds WHERE user_id = ?`;    
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


//team profile print details!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/readteamprofile', (req, res) => { 
  const user_id = req.session.user.user_id;
  const teamQuery = `SELECT * FROM teamsdetails WHERE team_id = ?`;    
  db.query(teamQuery, [user_id], (err, results) => {
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


//updating club profile !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post('/updateclubprofile', (req, res) => {
  
  const user_role = req.session.user.user_role;
  if (user_role !== "team") {
      return res.status(400).json({ error: 'not a team' });
  }

  if (!req.query.team_id || !req.query.new_team_desc || !req.query.new_team_link || !req.query.new_team_apps || !req.query.new_team_heads || !req.query.new_team_members) {
      return res.status(400).json({ error: 'Missing required fields for teamdetails update' });
  }

  const { team_id, new_team_desc, new_team_link, new_team_apps, new_team_heads, new_team_members } = req.query;

  const updateTeamQuery = `UPDATE teamsdetails SET team_desc = ?, team_link = ?, team_apps = ?, team_heads = ?, team_members = ? WHERE team_id = ?`;
  const updateTeamValues = [new_team_desc, new_team_link, new_team_apps, new_team_heads, new_team_members, team_id];

  db.query(updateTeamQuery, updateTeamValues, (err, teamResult) => {
      if (err) {
          console.error('Error updating team details:', err);
          return res.status(500).json({ error: 'Failed to update team details' });
      }
      if (teamResult.affectedRows === 0) {
          console.warn('Failed to update team details');
      }

      res.json({ success: true, message: 'Team details updated successfully' });
  });
});
