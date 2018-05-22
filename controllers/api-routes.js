const express = require('express');
const router = express.Router();
const groups = require("../models/group.js");
const users = require("../models/users.js");
const tasks = require("../models/task.js");
const async = require("async");
const apiObjGenerator = require("../public/assets/js/helper/template/apiObj.js");
router.get('/group/:id/join/:userId', function(req, res) {
  let apiResponse = apiObjGenerator();
  if(req.isAuthenticated()){
    if(req.user.userId == req.params.userId && req.params.id.length > 0){
      groups.selectGroupWithId(req.params.id, function(err, result){
        if(result.length > 0){
          const asyncFunctions = [
            function(callback){
              users.addUserGroup(req.params.userId, req.params.id, callback);
            }, 
            function(callback){
              groups.groupAddUser(req.params.id, req.params.userId, callback);
            }
          ];
          async.series(asyncFunctions, function(err, result){
            apiResponse.msg = "Group Added! Currently Status: Added";
            res.json(apiResponse);
          });
        }else{
          apiResponse.error = true;
          apiResponse.msg = "No such group";
          res.json(apiResponse);
        }
      });
    }else{
      apiResponse.error = true;
      apiResponse.msg = "Group Id invalid or User Id invalid";
      res.json(apiResponse);
    }
  }else{
    apiResponse.error = true;
    apiResponse.msg = "Not Authorized";
    res.json(apiResponse);
  }
});
router.get('/group/:id/members', function(req, res){
  let apiResponse = apiObjGenerator();
  if(req.isAuthenticated()){
    groups.selectGroupMembersWithGroupId(req.params.id, function(err, resultMembers){
      if(resultMembers.length > 0 ){
        let asyncFunctions = [];
        for(let i = 0; i < resultMembers.length; i++){
          asyncFunctions.push(function(callback){
            users.selectUserWithId(resultMembers[i].member, function(err, resultUser){
              callback(err, resultUser[0]);
            });
          });
        }
        async.series(asyncFunctions, function(err, result){
          apiResponse.data = [result,resultMembers] ;
          res.json(apiResponse);
        });
      }else{
        apiResponse.error = true;
        apiResponse.msg = "Not Authorized";
        res.json(apiResponse);
      }
    });
  }else{
    apiResponse.error = true;
    apiResponse.msg = "Not Authorized";
    res.json(apiResponse);
  }
});
router.delete("/group/:id/delete/:memberId", function(req, res){
  let apiResponse = apiObjGenerator();
  
  if(req.isAuthenticated()){
    let currentUser = req.user.userId;
    let allowed = false;
    if(req.params.id){
      groups.selectGroupMembersWithGroupId(req.params.id, function (err, result) {
        for(let i =0; i < result.length; i++){
          if(req.user.userId == result[i].member && result[i].position == "admin"){
            allowed = true;
            break;
          }else if(req.user.userId == req.params.memberId && req.user.userId == result[i].member && result[i].position != 'admin') {
            allowed = true;
            break;
          }
        }
        if(allowed){
          groups.groupDeleteUser(req.params.id, req.params.memberId, function(err, result){
            apiResponse.msg = "Successfully Removed";
            res.json(apiResponse);
          });
        }else{
           apiResponse.error = true;
           apiResponse.msg = "Not Authorized";
           res.json(apiResponse);
        }
      });
    }else{
       apiResponse.error = true;
       apiResponse.msg = "Not Authorized";
       res.json(apiResponse);
    }
  }else{
    apiResponse.error = true;
    apiResponse.msg = "Not Authorized";
    res.json(apiResponse);
  }
});
router.get("/group/:groupId/task/:taskId", function(req, res){
  let apiResponse = apiObjGenerator();
  let userIds = "";
  if(req.isAuthenticated()){
    const asyncFunctions = [
      function (callback) {
        tasks.getTaskByTaskId(req.params.groupId, req.params.taskId, function(err, result){
          console.log(result);
          userIds = result[0].completedMembers;
          callback(err, result);
        });
      },
      function(callback){
        console.log(userIds)
        tasks.getAllTaskSubmission(req.params.groupId, req.params.taskId, userIds, callback);
      }
    ];

    async.series(asyncFunctions, function(err, result){
      let filteredResult = result[0][0];
      filteredResult.submissions = result[1];
      apiResponse.msg = "Success";
      apiResponse.data = filteredResult;
      res.json(apiResponse);
    });
  }else{
    apiResponse.error = true;
    apiResponse.msg = "Not Authorized";
    res.json(apiResponse);
  }
});
router.post("/group/:groupId/task/:taskId", function(req, res){
  let apiResponse = apiObjGenerator();
  if(req.isAuthenticated()){
    groups.selectGroupWithId(req.params.groupId, function(err, result){
      if(result.length > 0 ){
        tasks.getTasksWithGroupId(req.params.groupId, function(err, result){
          let foundTask = false;
          result.forEach(function(task){
            if(task.taskId == parseInt(req.params.taskId)){
              foundTask = true;
            }
          });
          if(foundTask){
            users.selectUserWithId(req.user.userId, function(err, result){
              tasks.completeTask(req.params.taskId, req.user.userId, result[0].username, req.params.groupId, req.body.content, function (err, result) {
                apiResponse.msg = "Success";
                res.json(apiResponse);
              });
            });
          }else{
            apiResponse.error = true;
            apiResponse.msg = "Not Authorized";
            res.json(apiResponse);
          }
        });
      }else{
        apiResponse.error = true;
        apiResponse.msg = "Not Authorized";
        res.json(apiResponse);
      }
    });
  }else{
    apiResponse.errapiResponse.error = true;
    apiResponse.msg = "Not Authorized";
    res.json(apiResponse);
  }
});
router.get("/group/:groupId/tasks", function(req, res){
  let apiResponse = apiObjGenerator();
  if(req.isAuthenticated()){
    tasks.getTasksWithGroupId(req.params.groupId, function(err, result){
      apiResponse.data = result;
      res.json(apiResponse);
    });
  }else{
    apiResponse.error = true;
    res.json(apiResponse);
  }
});
/*
router.put("/group/:id/accept/:memberId", function(req, res){
  
});
*/
router.get('/chat/:userId/:chatId', function(req, res) {});

module.exports = router;
