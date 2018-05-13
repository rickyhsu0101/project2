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
const session = require('express-session');
const passport = require('passport');
dotenv.config();

// create the server
const app = express();
const PORT = 8080;

// initialize chat connection
const http = require('http').Server(app);
const io = require('socket.io')(http);
const connectChat = require('./controllers/sockets/sockets');
connectChat(io);

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

// validation middleware
app.use(expressValidator());
app.use(cookieParser());
app.use(
  session({
    secret: 'afdhu19h3f0ph10f',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// require all routes
app.use(require('./controllers/html-routes.js'));
//app.use('/api', require('./controllers/api-routes.js'));

// start the server
http.listen(PORT, () => console.log('listening on ' + PORT));
