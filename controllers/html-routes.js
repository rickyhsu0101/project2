const express = require('express');
const { validationResult } = require('express-validator/check');
const objGenerator = require('../public/assets/js/helper/template/templateObj.js');

const users = require('../models/users.js');
const groups = require('../models/group.js');
const uploads = require('../models/upload.js');
const tasks = require('../models/task.js');
const bcrypt = require('bcrypt');
const async = require('async');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// image upload middleware

const upload = require('../public/assets/js/middleware/multer/upload.js');

const avatar = upload.single('avatar');

const router = express.Router();
//number of words used for hash
const saltRounds = 10;

require('../public/assets/js/helper/authentication/localStrategy.js')(passport, LocalStrategy);

router.get('/profile/:id', function(req, res) {
  users.selectUserWithId(req.params.id, function(err, result) {
    if (result.length == 0) {
      res.redirect('/profile/notFound');
    } else {
      let obj = objGenerator();
      obj.page = 'profile';
      delete result[0].password;
      obj.profile = result[0];
      if (req.isAuthenticated()) {
        let localUser = req.user;
        delete localUser.password;
        obj.user = localUser;
      }
      res.render('index', obj);
    }
  });
});
router.get('/profile/notFound', function(req, res) {
  res.end('profile not found');
});


router.get('/group/notFound', function (req, res) {
  res.end('group');
});

// renders home page
router.get('/', function(req, res) {
  const obj = objGenerator();
  if (req.isAuthenticated()) {
    obj.user = req.user;
  }
  obj.page = 'home';
  res.render('index', obj);
});

// renders chat page
router.get('/chat', function(req, res) {
  const obj = objGenerator();
  if (req.isAuthenticated()) {
    obj.user = req.user;
  }
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

router.post('/newGroup', function(req, res) {
  avatar(req, res, err => {
    if (err) {
      res.redirect('/');
      return console.log('File size too large.');
    } else {
      //logic to check group's existence
      groups.addGroup(req.body.groupName, req.body.groupDesc, req.user.userId, function (err, resultId) {
        uploads.addFile(resultId, req.file.filename, "avatar", "group", function (err, result) {
          console.log(resultId);
          res.redirect('/group/' + resultId);
        });
      });
      return true;
    }
  });
});

// renders form to create a new group
router.get('/newgroup', (req, res) => {
  const obj = objGenerator();
  if (req.isAuthenticated()) {
    let localUser = req.user;
    delete localUser.password;
    obj.user = localUser;
    obj.page = 'newgroup';
    res.render('index', obj);
  } else {
    res.render('index', obj);
  }
});

// removes the users session and sends them to the home page
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/groups', (req, res) => {
  const obj = objGenerator();
  obj.page = 'groups';
  
  groups.getAllGroups(function (err, result) {
    obj.groups = result;
    if (req.isAuthenticated()) {
      users.selectUserWithId(req.user.userId, function(err, result){
        obj.user = result[0];
        res.render('index', obj)
      });

    }else{
      res.render('index', obj);
    }
   
  });

});

router.get('/group/:id', function(req, res) {
  groups.selectGroupWithId(req.params.id, function(err, result) {
    if (result.length == 0) {
      res.redirect('/group/notFound');
    } else {
      const obj = objGenerator();
      obj.page = 'group';
      const group = result[0];
      obj.group = group;

      let asyncFunctions = [
        function (callback) {
          tasks.getTasksWithGroupId(result[0].groupId, function (err, result) {
            console.log(result);
            callback(err, result);
          });
        },
        function (callback) {
          groups.selectGroupMembersWithGroupId(result[0].groupId, function (err, result) {
            console.log(result);
            callback(err, result);
          });
        },
        function (callback) {
          groups.getAvatarById(result[0].groupId, function (err, result) {
            callback(err, result);
          });
        }
      ];
      if (req.isAuthenticated()) {
        let localUser = req.user;
        delete localUser.password;
        obj.user = localUser;
        asyncFunctions.push(function(callback){
          users.selectUserWithId(obj.user.userId, function(err, result){
            callback(err, result);
          });
        });
      }
      async.series(
        asyncFunctions,
        function (err, result) {
          obj.group['tasks'] = result[0];
          obj.group['info'] = result[1];
          obj.group['groupAvatar'] = result[2][0].fileName;
          obj.user = result[3][0];
          res.render('index', obj);
        }
      );
    }
  });
});

// renders sign up page
router.get('/register2', function(req, res) {
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
});
router.get('/register', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/profile/' + req.user.userId);
  } else {
    let obj = objGenerator();
    obj.page = 'register';
    res.render('index', obj);
  }
});

//********** AUTHENTICATION STUFF? ***********/
//********** MOVE LOGIC TO SEPARATE FILE**********/
const checksLogin = require('../public/assets/js/helper/validation/loginValidationCheck.js');
router.post('/login', checksLogin, function(req, res) {
  //to be completed
  console.log("hello");
  const errors = validationResult(req);
  //validation the form data
  if (!errors.isEmpty()) {
    //run if error exists
    //map to object
    let errorsObj = errors.mapped();
    let errorsKey = Object.keys(errorsObj);
    let obj = objGenerator();
    obj.page = 'login';
    obj.errors = [];

    //append each error to the errors array property of template obj
    errorsKey.forEach(function(errorKey) {
      obj.errors.push(errorsObj[errorKey]);
    });
    //render file
    res.render('index', obj);
  } else {
    //if no validation errors
    //try finding a user row with the username
    users.selectUserWithUsername(req.body.username, function(err, result) {
      if (result.length == 0) {
        //if there is no result
        let obj = objGenerator();
        obj.page = 'login';
        obj.errors = [];
        obj.errors.push({
          msg: 'No User with Username'
        });

        res.render('index', obj);
      } else {
        //if there is a result, get password
        let hash = result[0].password;

        //use bcrypt to check for pass
        bcrypt.compare(req.body.password, hash, function(err, resBool) {
          if (resBool) {
            //if plaintext matches hash password, login(passport)
            passport.authenticate('local', {
              successRedirect: '/profile/' + result[0].userId,
              failureRedirect: '/login'
            })(req, res);
          } else {
            //if passwords don't match
            let obj = objGenerator();
            obj.page = 'login';
            obj.errors = [];
            obj.errors.push({
              msg: 'Password Incorrect'
            });
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
    //run two asynchronous function in series
    //one checks for email
    //other checks for username
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
        //if either result of both mysql query has some results then email or username exists
        if (result[0].length > 0) {
          obj.errors = [];
          obj.errors.push({
            msg: 'Email is already in use'
          });
          console.log(obj);
          res.render('index', obj);
        } else if (result[1].length > 0) {
          obj.errors = [];
          obj.errors.push({
            msg: 'Username already exists'
          });
          res.render('index', obj);
        } else {
          //if username and email are both new, hash the password
          bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            //add the user to the users table
            users.addUser(req.body.username, req.body.email, hash, function(error, result) {
              //use passport login for user session cookie
              passport.authenticate('local', {
                successRedirect: '/profile/' + result[0].userId,
                failureRedirect: '/login'
              })(req, res);
            });
          });
        }
      }
    );
  }
});

module.exports = router;
