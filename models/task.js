const orm = require("./orm.js");
const moment = require("moment");
const async = require("async");
const groupTaskRules = [
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
const userTaskRules = [
  'userId INT NOT NULL',
  'username TEXT NOT NULL',
  'taskId INT NOT NULL',
  'groupId INT NOT NULL',
  'time BIGINT NOT NULL',
  'content TEXT NOT NULL',
  'status TEXT NOT NULL'
];
const task = {
  createUserTaskTable: function(userId, cb){
    orm.createTable("user_" + userId + "_task", userTaskRules, function(err, result){
      cb(err, result);
    });
  },
  addUserTask: function(userId, username, groupId, taskId, taskContent, cb){
    
    const values = {
      userId: userId,
      username: username,
      taskId: taskId,
      groupId: groupId,
      content: taskContent,
      status: "completed",
      time: moment().format("X")
    };
    orm.insertOneWithoutParams("user_" + userId + "_task", values, cb);
  },
  getAllTaskSubmission: function(groupId, taskId, userIds, cb){
    let tables = [];
    let where = {};
    let user = [];
    
    if(userIds != ""){
      let userArray = userIds.split(",");
      userArray.forEach(function(value){
        tables.push("user_" + value + "_task");
        const obj = {};
        where["user_" + value + "_task"] = {taskId: taskId};
      });
        orm.selectMultipleAllParamWithOrder(tables, where, "time", cb);
    }else{
      cb(null, []);
    }
  },
  //add a group task table
  addGroupTaskTable: function (groupId, cb) {
    orm.createTable("group_" + groupId + "_task", groupTaskRules, function (err, result) {
      cb(err, result);
    });
  },
  //add a task to the group task table
  addTask: function (groupId, taskName, taskDesc, taskPoints, retry, cb) {
    const values = {
      taskName: taskName,
      taskDesc: taskDesc,
      taskPoints: taskPoints,
      completedMembers: "",
      successMembers: "",
      failureMembers: "",
      submitTime: "",
      retry: retry
    }
    orm.insertOneWithoutParams("group_" + groupId + "_task", values, function (err, result) {
      cb(err, result);
    });
  },
  getTaskByTaskId: function(groupId, taskId, cb){
    const where = {
      taskId: taskId
    };
    orm.selectAllParam("group_" + groupId + "_task", where, function(err, result){
      cb(err, result);
    });
  },
  getTasksWithGroupId: function (groupId, cb) {
    orm.selectAll("group_" + groupId + "_task", function (err, result) {
      cb(err, result);
    });
  },
  completeTask: function(taskId, userId, username, groupId, content, cb){
    const asyncFunction = [
      function(callback){
        task.getTaskByTaskId(groupId, taskId, function(err, result){
          let selectedTask = result[0];
          let completedConcat = selectedTask.completedMembers;
          if(completedConcat == ""){
            completedConcat += userId;
          }else{
            completedConcat += "," + userId;
          }
          const where = {
            taskId: taskId
          };
          const set = {
            completedMembers: completedConcat
          };
          orm.updateSingleRow("group_" + groupId + "_task",set, where, callback);
        });
      },
      function(callback){
        task.addUserTask(userId, username, groupId, taskId, content, callback);
      }
    ];
    async.series(asyncFunction, cb);
  }
};
module.exports = task;