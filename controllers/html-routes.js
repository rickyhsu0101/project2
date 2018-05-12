const express = require('express');
const router = express.Router();
const {
  validationResult
} = require("express-validator/check");
const objGenerator = require('./helper/templateObj.js');
const users = require("../models/users.js");
const bcrypt = require("bcrypt");
const async = require("async");
const saltRounds = 10;

router.get('/', function (req, res) {});
router.get('/login', function (req, res) {
  let obj = objGenerator();
  obj.page = 'login';
  res.render('index', obj);
});


router.get('/profile/:id', function (req, res) {
  //to be completed
  res.end();
});
router.get('/register', function (req, res) {
  let obj = objGenerator();
  obj.page = "register";
  res.render("index", obj);
});
const checksLogin = require("./helper/validation/loginValidationCheck.js");
router.post("/login", checksLogin, function (req, res) {
  //to be completed
});

const checksRegistration = require("./helper/validation/registerValidationCheck.js");
router.post("/register", checksRegistration, function (req, res) {
  //check for validation
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //if validation errors exist setup templateObj and render it
    let errorsObj = errors.mapped();
    let errorsKey = Object.keys(errorsObj);
    let obj = objGenerator();
    obj.page = "register";
    obj.errors = [];
    errorsKey.forEach(function (errorKey) {
      obj.errors.push(errorsObj[errorKey]);
    });
    res.render("index", obj);
  } else {
    //check if username exists
    //run two asynchronous function in series
    async.series([
      function (callback) {
        users.selectUserWithEmail(req.body.email, callback);
      },
      function (callback) {
        users.selectUserWithUsername(req.body.username, callback);
      }
    ], function (err, result) {
      let obj = objGenerator();
      obj.page = "register";
      if (result[0].length > 0) {
        obj.errors = ["Email is already used"];
        res.render("index", obj);
      } else if (result[1].length > 0) {
        obj.errors = ["Username already exists"];
        res.render("index", obj);
      } else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          users.addUser(req.body.username, req.body.email, hash, function (error, result) {
            res.redirect("/profile/" + result.userId);
          });
        });
      }
    });
  }
});


module.exports = router;