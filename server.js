const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const rfs = require('rotating-file-stream');
const dotenv = require('dotenv');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
dotenv.config();

// create the server
const app = express();
const PORT = 8080;

// create a write stream to add log entries to access.log.
// the object passed in opens the file for appending, and creates the file if it does not exist
// 'combined' represents the format to write the log. This is the standard apache log format
const accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), {
  flags: 'a'
});
app.use(morgan('combined', { stream: accessLogStream }));

// specify the view engine and file locations
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// static file locations
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/dist')));

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// form validation
app.use(expressValidator());

// routes
app.use(require('./controllers/html-routes.js'));
//app.use(require('./controllers/api-routes.js'));

// start the server
app.listen(PORT, function() {
  console.log('listening on ' + PORT);
});
