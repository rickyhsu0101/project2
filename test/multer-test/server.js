const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const upload = require('./upload');
const avatar = upload.single('avatar');
const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     console.log(file);
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// var up = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     if (ext != '.png' && ext != '.jpg' && ext != '.jpeg') {
//       cb(new Error("Not jpg"));
//     } else {
//       cb(null, true);
//     }
//   }
// }).single('avatar');

// Sets up Express to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// uploads the file to the server
app.post('/profile', (req, res) => {
  // checks for errors
  console.log(req.body);
  console.log(req.file);
  console.log(req.files);
  avatar(req, res, err => {
    if (err) {
      return console.log('File size too large.');
    }
    console.log('file uploaded');
    return true;
  });
  res.redirect('/');
});
// app.post('/profile', function (req, res) {
//   up(req, res, function (err) {
//     console.log(req.file);
//     console.log(req.body);
//     if (err) {
//       console.log("there is an error")
//     }
//     res.redirect("/");

//   });
// });
app.listen(3000, () => console.log('Listening on localhost:3000'));
