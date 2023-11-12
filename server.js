const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
const routes = require('./routes');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/user', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
