const path = require('path');
const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');

// creates storage location and file name for a users avatar
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Sets up Express to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/profile', upload.single('avatar'), function(req, res) {
  console.log(req.body);
  console.log(req.file);
  res.redirect('/');
});

app.listen(3000, function() {
  console.log('Listening on localhost:3000');
});
