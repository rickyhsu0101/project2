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

const PORT = 8080;
const app = express();

// create a write stream to add log entries to access.log. the object passed in opens the file for appending, and creates the file if it does not exist
const accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), {
  flags: 'a'
});

//view engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// creates a log entry for each http request. specifies the location to write the log
// 'combined' represents the format to write the log. This is the standard apache log format
app.use(morgan('combined', { stream: accessLogStream }));

app.use(require('./controllers/html-routes.js'));
app.use(require('./controllers/api-routes.js'));

app.listen(PORT, function() {
  console.log('listening on ' + PORT);
});
