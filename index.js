const express = require('express');
require('dotenv').config();
require('./db/connection').connect();
const app = express();

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log('app listening on port ' + PORT);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});