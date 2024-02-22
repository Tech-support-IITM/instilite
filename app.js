const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const db = require('./database');

app.use(bodyParser.json());


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Endpoint to add events
app.post('/pushevents', (req, res) => {
  const { start, end, title, venue} = req.query;

  // Validate parameters
  if (!start || !end || !title || !venue) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  // Insert event into the database
  const query = `INSERT INTO eventsdetails (event_name, event_venue, event_desc, event_posted_date, event_date, event_start, event_end) VALUES (?, ?, DEFAULT, ?, ?, ?, ?)`;
  const values = [title, venue, '', '','', start.slice(0, 10), start.slice(11),end.slice(11)]; // Assuming venue and description are optional
  db.query(query, values, (err, result) => {                       
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add event' });
    } else {
      res.json({ success: true, message: 'Event added successfully' });
    }
  });
});

// Endpoint to get all events
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


