//node server
'use strict'

//Import Dependencies
let express = require('express');
let bodyParser = require('body-parser');

//Creating Instances
let app = express();
let router = express.Router();

//Set port to as defined in environment or default is 3001
var port = process.env.API_PORT || 3001;

process.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.log("");
});

//configuring body parser to look for body data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//Environment File
require('dotenv').config();

//Router Configuration
require('./routes/routes.js')(app);

//Starts the server and listens for requests
app.listen(port, function () {
  console.log(`API running on port ${port}`);
});