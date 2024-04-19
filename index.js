const express = require('express');
const { errorHandler } = require("./middlewares/error");
require('./db/connection').connect();
var cors = require('cors')
require('dotenv').config();
const userRouter = require('./routes/user');
const authorRouter = require('./routes/author');
const blogRouter = require('./routes/blog');

const app = express();
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8000

app.use('/api/v1/user', userRouter);
app.use('/api/v1/author', authorRouter);
app.use('/api/v1/blog', blogRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('app listening on port ' + PORT);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});