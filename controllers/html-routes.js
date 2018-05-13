const express = require('express');
const { validationResult } = require('express-validator/check');
const objGenerator = require('../public/assets/js/helper/template/templateObj.js');
const users = require('../models/users.js');
const bcrypt = require('bcrypt');
const async = require('async');
const passport = require('passport');

// image upload middleware
const upload = require('../middleware/multer/upload');
const avatar = upload.single('avatar');

const router = express.Router();
//number of words used for hash
const saltRounds = 10;
passport.serializeUser(function(userId, done) {
  done(null, userId);
});

passport.deserializeUser(function(userId, done) {
  done(null, userId);
});

// renders home page
router.get('/', function(req, res) {
  const obj = objGenerator();
  obj.page = 'home';
  res.render('index', obj);
});

// renders chat page
router.get('/chat', function(req, res) {
  const obj = objGenerator();
  obj.page = 'chat';
  res.render('index', obj);
});

// renders login page
router.get('/login', function(req, res) {
  //passport authentication
  if (req.isAuthenticated()) {
    res.redirect('/profile/' + req.user.userId);
  } else {
    let obj = objGenerator();
    obj.page = 'login';
    res.render('index', obj);
  }
});

// renders page to display groups
router.get('/groups', (req, res) => {
  const obj = objGenerator();
  obj.page = 'groups';
  res.render('index', obj);
});

// renders form to create a new group
router.get('/newgroup', (req, res) => {
  const obj = objGenerator();
  obj.page = 'newgroup';
  res.render('index', obj);
});

// renders sign up page
router.get('/register', function(req, res) {
  //****IMAGE UPLOADS *****/
  // uploads the file to the server when a user signs up
  avatar(req, res, err => {
    // checks for errors
    if (err) {
      return console.log('File size too large.');
    }
    console.log('file uploaded');
    return true;
  });

  if (req.isAuthenticated()) {
    res.redirect('/profile/' + req.user.userId);
  } else {
    let obj = objGenerator();
    obj.page = 'register';
    res.render('index', obj);
  }
});

// renders user profile after signin
router.get('/profile/:id', function(req, res) {
  //to be completed
  res.end();
});

//********** AUTHENTICATION STUFF? ***********/
//********** MOVE LOGIC TO SEPARATE FILE**********/

const checksLogin = require('../public/assets/js/helper/validation/loginValidationCheck.js');
router.post('/login', checksLogin, function(req, res) {
  //to be completed
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorsObj = errors.mapped();
    let errorsKey = Object.keys(errorsObj);
    let obj = objGenerator();
    obj.page = 'login';
    obj.errors = [];
    errorsKey.forEach(function(errorKey) {
      obj.errors.push(errorsObj[errorKey]);
    });
    res.render('index', obj);
  } else {
    users.selectUserWithUsername(req.body.username, function(err, result) {
      if (result.length == 0) {
        let obj = objGenerator();
        obj.page = 'login';
        obj.errors = ['No User with Username'];
        res.render('index', obj);
      } else {
        let hash = result[0].password;
        bcrypt.compare(req.body.password, hash, function(err, resBool) {
          if (resBool) {
            req.login(result[0].userId, function(err) {
              res.redirect('/profile/' + result[0].userId);
            });
          } else {
            let obj = objGenerator();
            obj.page = 'login';
            obj.errors = ['Password Incorrect'];
            res.render('index', obj);
          }
        });
      }
    });
  }
});

const checksRegistration = require('../public/assets/js/helper/validation/registerValidationCheck.js');
router.post('/register', checksRegistration, function(req, res) {
  //check for validation
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //if validation errors exist setup templateObj and render it
    let errorsObj = errors.mapped();
    let errorsKey = Object.keys(errorsObj);
    let obj = objGenerator();
    obj.page = 'register';
    obj.errors = [];
    errorsKey.forEach(function(errorKey) {
      obj.errors.push(errorsObj[errorKey]);
    });
    res.render('index', obj);
  } else {
    //check if username exists
    //run two asynchronous function in series
    async.series(
      [
        function(callback) {
          users.selectUserWithEmail(req.body.email, callback);
        },
        function(callback) {
          users.selectUserWithUsername(req.body.username, callback);
        }
      ],
      function(err, result) {
        let obj = objGenerator();
        obj.page = 'register';
        if (result[0].length > 0) {
          obj.errors = ['Email is already used'];
          res.render('index', obj);
        } else if (result[1].length > 0) {
          obj.errors = ['Username already exists'];
          res.render('index', obj);
        } else {
          bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            users.addUser(req.body.username, req.body.email, hash, function(error, result) {
              req.login(result.userId, function(err) {
                res.redirect('/profile/' + result.userId);
              });
            });
          });
        }
      }
    );
  }
});

module.exports = router;
