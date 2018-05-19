const express = require('express');
const router = express.Router();
const groups = require("../models/group.js");
const users = require("../models/users.js");
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
              groups.groupAddPendingUser(req.params.id, req.params.userId, callback);
            }
          ];
          async.series(asyncFunctions, function(err, result){
            apiResponse.msg = "Group Added! Currently Status: Pending";
            console.log(apiResponse);
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
          console.log(apiResponse.data);
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
    let isAdmin = false;
    if(req.params.id){
      groups.selectGroupMembersWithGroupId(req.params.id, function (err, result) {
        for(let i =0; i < result.length; i++){
       //   if(parseInt(req.params.id)==)
          if(req.user.userId == result[i].member && result[i].position == "admin"){
            isAdmin = true;
            break;
          }
        }
        if(isAdmin){
          //delete member from group
          
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
/*
router.put("/group/:id/accept/:memberId", function(req, res){
  let apiResponse = apiObjGenerator();
  if (req.isAuthenticated()) {

  }
});
*/
router.get('/chat/:userId/:chatId', function(req, res) {});

module.exports = router;
