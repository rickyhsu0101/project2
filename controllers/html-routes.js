const express = require('express');
const router = express.Router();

const objGenerator = require("./helper/templateObj.js");


router.get('/', function (req, res) {});
router.get('/login', function (req, res) {
    let obj = objGenerator();
    obj.page = "login";
    res.render("index", obj);
});
router.get('/profile/:id', function (req, res) {});
router.get('/register', function (req, res) {});

module.exports = router;