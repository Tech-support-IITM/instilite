const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(require('./routes/login'));


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
