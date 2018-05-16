const orm = require('./orm.js');
const chat = require('./chat.js');
const upload = require("./upload.js");
const async = require("async");
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
    //add new user to users
    //create new user chat table
    addUser: function (username, email, password, cb) {
        let keyValues = {
            username: username,
            email: email,
            password: password,
            friends: "",
            groups: ""
        };
        orm.insertOneWithoutParams("users", keyValues, function (err, result) {
            users.selectUserWithUsername(username, function (err, resultUser) {
                async.series([
                    function (callback) {
                        chat.createUserChat(resultUser[0].userId, function (err, result) {
                            callback(err, resultUser);
                        });
                    },
                    function (callback) {
                        upload.createUserUploadTable(resultUser[0].userId, function (err, result) {
                            callback(err, result);
                        });
                    }
                ], function (err, result) {
                    cb(err, result[0]);
                });
            });
        });
    },
    //append groupId to groups in user row
    addUserGroup: function (userId, groupId, cb) {
        users.selectUserWithId(userId, function (err, result) {
            let currentGroups = result[0].groups;
            if (currentGroups.length > 0) {
                currentGroups += "," + groupId
            } else {
                currentGroups = groupId;
            }
            orm.updateSingleRow("users", {
                groups: currentGroups
            }, {
                userId: userId
            }, function (err, result) {
                cb(err, result);
            });
        });
    },
    selectUserWithId: function (id, cb) {
        let where = {
            userId: id
        };
        orm.selectAllParam('users', where, function (err, result) {
            cb(err, result);
        });
    },
    selectUserWithUsername: function (username, cb) {
        let where = {
            username: username
        };
        orm.selectAllParam('users', where, function (err, result) {
            cb(err, result);
        });
    },
    selectUserWithEmail: function (email, cb) {
        let where = {
            email: email
        };
        orm.selectAllParam('users', where, function (err, result) {
            cb(err, result);
        });
    }
};
module.exports = users;