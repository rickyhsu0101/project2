const orm = require('./orm.js');
const chat = require('./chat.js');
const task = require('./task.js');
const users = require('./users.js');
console.log(users);
const upload = require('./upload.js');
const async = require('async');
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
];
const groupInfoRules = [
  'member INT NOT NULL',
  'position VARCHAR(100)',
  'points BIGINT NOT NULL',
  'level BIGINT NOT NULL'
];
const group = {
  //add new group to groups table
  //add new chat to chat_room table
  //append new groupId to users table row
  //add group info and task tables
  //nothing is returned
  addGroup: function(groupName, groupDesc, userId, cb) {
    chat.creatChatRoom(userId, groupName + ' Chat', function(err, result) {
      const chatId = result[0].roomId;
      const values = {
        groupName: groupName,
        groupDesc: groupDesc,
        groupMembers: '' + userId,
        chatId: chatId
      };
      orm.insertOneWithoutParams('groups', values, function(err, result) {
        const values = {
          member: userId,
          position: 'admin',
          points: 0,
          level: 0
        };
        group.selectGroupWithGroupName(groupName, function(err, result) {
          const groupId = result[0].groupId;
          async.series(
            [
              function(callback) {
                orm.createTable('group_' + result[0].groupId + '_info', groupInfoRules, function(
                  err,
                  result
                ) {
                  callback(err, result);
                });
              },
              function(callback) {
                task.addGroupTaskTable(result[0].groupId, function(err, result) {
                  callback(err, result);
                });
              },
              function(callback) {
                users.addUserGroup(userId, result[0].groupId, function(err, result) {
                  callback(err, result);
                });
              },
              function(callback) {
                upload.createGroupUploadTable(result[0].groupId, function(err, result) {
                  callback(err, result);
                });
              },
              function(callback) {
                orm.insertOneWithoutParams('group_' + result[0].groupId + '_info', values, function(
                  err,
                  result
                ) {
                  callback(err, result);
                });
              }
            ],
            function(err, result) {
              cb(err, groupId);
            }
          );
        });
      });
    });
  },
  //select group by group name
  //result[0] for the row obj
  selectGroupWithGroupName: function(groupName, cb) {
    const values = {
      groupName: groupName
    };
    orm.selectAllParam('groups', values, function(err, result) {
      cb(err, result);
    });
  },
  selectGroupWithId: function(groupId, cb) {
    const values = {
      groupId: groupId
    };
    orm.selectAllParam('groups', values, function(err, result) {
      cb(err, result);
    });
  },
  selectGroupMembersWithGroupId: function(groupId, cb) {
    orm.selectAll('group_' + groupId + '_info', function(err, result) {
      cb(err, result);
    });
  },
  getAvatarById: function(groupId, cb) {
    upload.getFileByType(groupId, 'group', 'avatar', function(err, result) {
      cb(err, result);
    });
  },
  getAllGroups: function(cb) {
    orm.selectAll('groups', function(err, result) {
      cb(err, result);
    });
  },
  getMultipleGroups: function(groupIds, cb) {
    let asyncFunctions = [];
    groupIds.forEach(function(id) {
      asyncFunctions.push(function(callback) {
        group.selectGroupWithId(id, function(err, result) {
          callback(err, result[0]);
        });
      });
    });
    async.series(asyncFunctions, function(err, result) {
      cb(err, result);
    });
  },
  groupAddUser: function(groupId, userId, cb ){
    const values = {
      member: parseInt(userId),
      position: "member",
      points: 0,
      level: 0,
    }
    orm.insertOneWithoutParams("group_" + groupId + "_info", values, function(err, result){
      group.selectGroupWithId(groupId, function(err, result){
        const set = {
          groupMembers: result[0].groupMembers + "," + userId
        };
        const where = {
          groupId: groupId
        };
        orm.updateSingleRow("groups", set, where, cb);
      });

    });
  },
  groupDeleteUser: function(groupId, userId, cb){
    const asyncFunctions = [
      function(callback){
        orm.deleteRowWithParams("group_" + groupId + "_info", {
          member: userId
        }, callback);
      },
      function(callback){
        users.removeUserGroup(userId, groupId, callback);
      },
      function(callback){
        group.selectGroupWithId(groupId, function(err, result){
          members = result[0].groupMembers.split(",");
          for(let i = 0; i < members.length; i++){
            if(members[i]==userId){
              members.splice(i,1);
              break;
            }
          }
          const set = {
            groupMembers: members.toString()
          };
          const where = {
            groupId: groupId
          };
          orm.updateSingleRow("groups", set, where, callback);
        });
      }
    ];
    async.series(asyncFunctions, cb);
  }
};
module.exports = group;
