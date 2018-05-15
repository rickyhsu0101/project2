const orm = require('./orm.js');
const users = require('./users.js');
const userChatRules = [
  'messageId INT AUTO_INCREMENT',
  'roomId INT NOT NULL',
  'groupMembers TEXT NOT NULL',
  'groupName VARCHAR(30)',
  'messageContent TEXT NOT NULL',
  'time BIGINT NOT NULL',
  'PRIMARY KEY(messageId)'
];
const chat = {
  //create a user chat table
  createUserChat: function (userId, cb) {
    orm.createTable(userId + "_chat", userChatRules, function (err, result) {
      cb(err, result);
    });
  },
  //get all chat from all user
  getChatById: function (chatId, cb) {
    //where clause for id
    let where = {
      roomId: chatId
    };
    orm.selectAllParam('chat_room', where, function (err, result) {
      if (result.length > 0) {
        let stringIdArr = result[0].members.split(',');
        let userChats = [];
        let whereMultiple = {};
        stringIdArr.forEach(function (val) {
          userChats.push(val + '_chat');
          whereMultiple[val + '_chat'] = {
            roomId: chatId
          };
        });
        orm.selectMultipleAllParamWithOrder(userChats, whereMultiple, 'time', function (
          err,
          result
        ) {
          cb(err, result);
        });
      } else {
        cb(null, []);
      }
    });
  },
  getAllChatIds: function (id, cb) {
    let chatRooms = [];
    orm.selectAll(id + '_chat', function (err, result) {
      result.forEach(function (row) {
        if (chatRooms.indexOf(row.roomId) != -1) {
          chatRooms.push(row.roomId);
        }
      });
      cb(err, chatRooms);
    });
  },
  //add chat message to user chat
  appendUserChat: function (userId, roomId, message, time, cb) {
    chat.getChatInfoByRoomId(roomId, function (err, result) {
      const values = {
        groupMembers: result[0].members,
        groupName: result[0].roomName,
        messageContent: message,
        time: time
      };
      orm.insertOneWithoutParams(userId + "_chat", values, function (err, result) {
        cb(err, result);
      });
    });

  },
  //create the chat_room by adding row to the table
  creatChatRoom: function (userId, roomName, cb) {
    const values = {
      roomName: roomName,
      members: "" + userId
    }
    orm.insertOneWithoutParams("chat_room", values, function (err, result) {
      chat.getChatInfoByRoomName(roomName, function (err, result) {
        cb(err, result);
      });
    });
  },
  //get chat row from chat_room table by room name
  getChatInfoByRoomName: function (roomName, cb) {
    orm.selectAllParam("chat_room", {
      roomName: roomName
    }, function (err, result) {
      cb(err, result);
    });
  },
  //get chat row from chat_room table by room id
  getChatInfoByRoomId: function (roomId, cb) {
    orm.selectAllParam("chat_room", {
      roomId: roomId
    }, function (err, result) {
      cb(err, result);
    });
  }
};
module.exports = chat;