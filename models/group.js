const orm = require("./orm.js");
const chat = require("./chat.js");
const task = require("./task.js");
const users = require("./users.js");
const async = require("async");
const groupRules = [
  'taskId INT AUTO_INCREMENT',
  'taskName VARCHAR(100) NOT NULL',
  'taskDesc TEXT',
  'taskPoints BIGINT DEFAULT 0',
  'completedMembers TEXT',
  'successMembers TEXT',
  'failureMembers TEXT',
  'submitTime TEXT',
  'retry BOOL DEFAULT true',
  'PRIMARY KEY(taskId)'
]
const group = {
  //add new group to groups table
  //add new chat to chat_room table
  //append new groupId to users table row
  //add group info and task tables
  //nothing is returned
  addGroup: function (groupName, userId, cb) {
    chat.creatChatRoom(userId, groupName + " Chat", function (err, result) {
      const chatId = result[0].roomId;
      const values = {
        groupName: groupName,
        groupMembers: "" + userId,
        chatId: chatId
      };
      orm.insertOneWithoutParams("groups", values, function (err, result) {
        const values = {
          member: "" + userId,
          position: "admin",
          points: 0,
          level: 0
        };
        group.selectGroupWithGroupName(groupName, function (err, result) {
          async.series([
            function (callback) {
              orm.createTable("group_" + result[0].groupId + "_info", groupRules, function (err, result) {
                callback(err, result);
              });
            },
            function (callback) {
              task.addGroupTaskTable(result[0].groupId, function (err, result) {
                callback(err, result);
              });
            },
            function (callback) {
              users.addUserGroup(userId, result[0].groupId, function (err, result) {
                callback(err, result);
              });
            }
          ], function (err, result) {
            cb(err, result);
          });
        });
      });
    });
  },
  //select group by group name
  //result[0] for the row obj
  selectGroupWithGroupName: function (groupName, cb) {
    const values = {
      groupName: groupName
    }
    orm.selectAllParam("groups", values, function (err, result) {
      cb(err, result);
    });
  }
};
module.exports = group;