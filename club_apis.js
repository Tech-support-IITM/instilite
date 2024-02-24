//initialising stuff

const express = require('express');
const jwt = require('jsonwebtoken');
//const { generateJwtToken } = require('./utils');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const db = require('./db');
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});



//personal profile print details !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/readuserprofile', (req, res) => { 
    const user_id = req.session.user.user_id
    const userQuery = `
    SELECT user_id, user_name, user_phone, linkedin_id, profile_desc
    FROM usercreds
    WHERE user_id = ?
  `;    
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
app.get('/readuserprofile', (req, res) => { 
    const user_id = req.session.user.user_id;
    const teamQuery = `
    SELECT *
    FROM teamsdetails
    WHERE team_id = ?
    `;    
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

    const updateTeamQuery = `
        UPDATE teamdetails
        SET team_desc = ?, team_link = ?, team_apps = ?, team_heads = ?, team_members = ?
        WHERE team_id = ?
    `;
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
 


