const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const upload = require('./upload');
const avatar = upload.single('avatar');

// Sets up Express to handle data parsing
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// uploads the file to the server
app.post('/profile', (req, res) => {
  // checks for errors
  console.log(req.body);
  avatar(req, res, err => {
    if (err) {
      return console.log('File size too large.');
    }
    console.log('file uploaded');
    return true;
  });
  res.redirect('/');
});

app.listen(3000, () => console.log('Listening on localhost:3000'));