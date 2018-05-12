const express = require('express');
var app = express();

const dotenv = require("dotenv");
dotenv.config();

var users = require("../users.js");
var chat = require("../chat.js");
app.get("/", function (req, res) {
    chat.getChatById(23141, function (err, result) {
        console.log(result);
        res.end();
    });
    /*
    users.selectUser(222, function (err, result) {
        console.log(result);
        res.end();
    });
    */
});

app.listen(8080, function () {
    console.log("Listening on " + 8080);
});