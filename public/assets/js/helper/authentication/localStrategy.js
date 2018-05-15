const users = require("../../../../../models/users.js");
var bcrypt = require("bcrypt");
module.exports = function (passport, LocalStrategy) {
  passport.use(new LocalStrategy(function (username, password, done) {
    users.selectUserWithUsername(username, function (err, result) {
      if (result.length == 0) {
        return done(null, false, {
          message: "Incorrect Username"
        });
      } else {
        bcrypt.compare(password, result[0].password, function (err, correct) {
          if (correct) {
            return done(null, result[0]);
          } else {
            return done(null, false, {
              message: "Incorrect Password"
            });
          }
        });
      }
    });
  }));
  //serialize user session cookie
  passport.serializeUser(function (userId, done) {
    done(null, userId);
  });
  //deserialize user session cookie
  passport.deserializeUser(function (userId, done) {
    done(null, userId);
  });
}