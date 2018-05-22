const express = require("express");
var router = express.Router();
router.get("/", function (req, res) {
    var obj = {
        user: {
            name: "Ricky",
            id: 121
        },
        groups: [{
            name: "ESports ASU",
            id: 1234,
            shortDesc: "This is a group for people interested in gaming and..."
        }],
        year: 2018,
        page: "home"
    }
    res.render("index", obj);
});
router.get("/profile/:id", function (req, res) {
    var obj = {
        user: {
            name: "Trevor",
            id: parseInt(req.params.id)
        },
        groups: [{
            name: "ESports ASU",
            id: 1234,
            shortDesc: "This is a group for people interested in gaming and..."
        }],
        year: 2018,
        page: "profile"
    }
    res.render("index", obj);
});

module.exports = router;