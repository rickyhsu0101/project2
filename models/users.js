const orm = require('./orm.js');
const userChatRules = [
  'messageId INT AUTO_INCREMENT',
  'roomId INT NOT NULL',
  'groupMembers TEXT NOT NULL',
  'groupName VARCHAR(30)',
  'messageContent TEXT NOT NULL',
  'time BIGINT NOT NULL',
  'PRIMARY KEY(messageId)'
];
const users = {
    addUser: function (username, email, password, cb) {
        let keyValues = {
            username: username,
            email: email,
            password: password,
            friends: ""
        };
        orm.insertOneWithoutParams("users", keyValues, function (err, result) {
            users.selectUserWithUsername(username, function (err, resultUser) {

                orm.createTable(resultUser[0].userId + "_chat", userChatRules, function (err, result) {
                    //the result of the fuction is the user row just created
                    cb(err, resultUser);
                });
            });
        });
    },
    selectUserWithId: function (id, cb) {
        let where = {
            userId: id
          });
        });
      });
    });
  },
  selectUserWithId: function(id, cb) {
    let where = {
      userId: id
    };
    orm.selectAllParam('users', where, function(err, result) {
      cb(err, result);
    });
  },
  selectUserWithUsername: function(username, cb) {
    let where = {
      username: username
    };
    orm.selectAllParam('users', where, function(err, result) {
      cb(err, result);
    });
  },
  selectUserWithEmail: function(email, cb) {
    let where = {
      email: email
    };
    orm.selectAllParam('users', where, function(err, result) {
      cb(err, result);
    });
  }
};
module.exports = users;
