const express = require("express");
const router = express.Router();

router.post("/api/register", function (req, res) {

    res.redirect("/profile");
});
router.get("/api/chat/:userId/:chatId", function (req, res) {

});
module.exports = router;