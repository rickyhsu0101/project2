const express = require('express');
var app = express();

const dotenv = require("dotenv");
dotenv.config();

var users = require("../../models/users.js");
var chat = require("../../models/chat.js");
var groups = require("../../models/group.js");

app.get("/", function (req, res) {
    groups.addGroup("Test 101", 123, function (err, result) {
        console.log(result);
        res.end();
    });
    // chat.getChatById(23141, function (err, result) {
    //     console.log(result);
    //     res.end();
    // });
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