const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const PORT = 8080;

const app = express();

//view engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());

app.use(require("./controllers/html-routes.js"));
//app.use(require("./controllers/api-routes.js"));

app.listen(PORT, function () {
  console.log('listening on ' + PORT);
});