const orm = require("../config/orm.js");
const users = require("./users.js");
const callbackChaining = require("./users");
const async = require("async");
const chat = {
    getChatById: function (chatId, cb) {
        //where clause for id
        let where = {
            roomId: chatId
        };
        orm.selectAllParam("chat_room", where, function (err, result) {
            if (result.length > 0) {
                let stringIdArr = result[0].members.split(",");
                let userChats = [];
                let whereMultiple = {};
                stringIdArr.forEach(function (val) {
                    userChats.push(val + "_chat");
                    whereMultiple[val + "_chat"] = {
                        roomId: chatId
                    };
                });
                orm.selectMultipleAllParamWithOrder(userChats, whereMultiple, "time", function (err, result) {
                    cb(err, result);
                });
            } else {
                cb(null, []);
            }
        });
    },
    getAllChatIds: function (id, cb) {
        let chatRooms = [];
        orm.selectAll(id + "_chat", function (err, result) {
            result.forEach(function (row) {
                if (chatRooms.indexOf(row.roomId) != -1) {
                    chatRooms.push(row.roomId);
                }
            });
            cb(err, chatRooms);
        });
    },
    addChat: function (username, cb) {

    }
};
module.exports = chat;