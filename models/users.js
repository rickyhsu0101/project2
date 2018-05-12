const orm = require("../config/orm.js");

const userChatRules = [
    "messageId INT AUTO_INCREMENT",
    "roomId INT NOT NULL",
    "groupMembers TEXT NOT NULL",
    "groupName VARCHAR(30)",
    "messageContent TEXT NOT NULL",
    "time BIGINT NOT NULL",
    "PRIMARY KEY(messageId)"
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
            orm.createTable(id + "_chat", userChatRules, function (err, result) {
                users.selectUserWithUsername(username, function (err, result) {
                    cb(err, result);
                });
            });
        });
    },
    selectUserWithId: function (id, cb) {
        let where = {
            userId: id
        };
        orm.selectAllParam("users", where, function (err, result) {
            cb(err, result);
        });
    },
    selectUserWithUsername: function (username, cb) {
        let where = {
            username: username
        };
        orm.selectAllParam("users", where, function (err, result) {
            cb(err, result);
        });
    },
    selectUserWithEmail: function (email, cb) {
        let where = {
            email: email
        };
        orm.selectAllParam("users", where, function (err, result) {
            cb(err, result);
        });
    }
};

module.exports = users;