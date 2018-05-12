const express = require('express');
const router = express.Router();
const {
  validationResult
} = require("express-validator/check");
const objGenerator = require('./helper/templateObj.js');
const users = require("../models/users.js");
const bcrypt = require("bcrypt");

const saltRounds = 10;

router.get('/', function (req, res) {});
router.get('/login', function (req, res) {
  let obj = objGenerator();
  obj.page = 'login';
  res.render('index', obj);
});


router.get('/profile/:id', function (req, res) {
  //to be completed
});
router.get('/register', function (req, res) {
  let obj = objGenerator();
  obj.page = "register";
  res.render("index", obj);
});
router.post("/login", function (req, res) {
  //to be completed
});
const checksRegistration = require("./helper/validation/registerValidationCheck.js");
router.post("/register", checksRegistration, function (req, res, next) {
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
    users.selectUserWithUsername(req.body.username, function (err, result) {
      if (result.length > 0) {
        let obj = objGenerator();
        obj.page = "register";
        obj.errors = ["Username already exists"];
        res.render("index", obj);
      } else {
        //check if email exists
        users.selectUserWithEmail(req.body.email, function (err, result) {
          if (result.length > 0) {
            let obj = objGenerator();
            obj.page = "register";
            obj.errors = ["Email already exists"];
            res.render("index", obj);
          } else {
            //if everything is ok, add the user
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
              users.addUser(req.body.username, req.body.email, hash, function (error, result) {
                res.redirect("/profile/" + result[0].userId);
              });
            });

          }
        });
      }
    });
  }
});


module.exports = router;