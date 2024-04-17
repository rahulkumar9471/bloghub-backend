const express = require('express');
require('./db/connection').connect();
var cors = require('cors')
require('dotenv').config();
const userRouter = require('./routes/user');
const authorRouter = require('./routes/author');

const app = express();
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8000

app.use('/api/v1',userRouter);
app.use('/api/v1',authorRouter);

app.listen(PORT, () => {
  console.log('app listening on port ' + PORT);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});