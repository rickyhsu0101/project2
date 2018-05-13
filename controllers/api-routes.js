const express = require('express');
const router = express.Router();

router.get('/register', function(req, res) {
  res.redirect('/profile');
});

router.get('/chat/:userId/:chatId', function(req, res) {});

module.exports = router;
