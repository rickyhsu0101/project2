import { headerInit } from '../general/header.js';

import '../../css/style.css';
import '../../css/group.css';

function updateMembers(){
  $("#membersDiv").empty();
  let membersQuery = "/api/group/" + $("#membersDiv").data("group").trim() + "/members";
  $.ajax({
    method: "GET",
    url: membersQuery
  }).done(function (response) {
    let power = $("#membersDiv").data("power").trim();
    let currentUserId = $("#membersDiv").data("userid").trim();
    if (!response.error) {
      console.log(response);
      console.log(response.data);
      var data = response.data;
      for (var i = 0; i < data[0].length; i++) {
        let memberHTML = $("<div class = 'member row'></div>");
        memberHTML.append("<div class = 'col s8'><a class= 'memberInfo' href = " +
          "'/profile/" + data[0][i].userId +
          "' data-id='" + data[0][i].userId + "'><h4>" +
          data[0][i].username + "</h4></a></div>");
        if (power == "admin") {
          if (data[0][i].userId != currentUserId) {
            memberHTML.append("<div class = 'col s4'><a class = 'wave-effect waves-light btn' href = '#'>" + "Remove" + "</a></div>");
          }
        }
        $("#membersDiv").append(memberHTML);
      }
    }

  });
}
$(document).ready(function() {
  headerInit();
  updateMembers();
  $("#joinGroup").on("click", function(e){
    e.preventDefault();
    var userId = $(this).data("user").trim();
    var groupId = $(this).data("group").trim();
    var query = "/api/group/" + groupId + "/join/" + userId;
    $.ajax({
      method: "GET",
      url: query
    }).done(function(data){
      if(!data.error){
        $("#joinGroupDiv").remove();
        updateMembers();
        $("#leaveGroupRow").removeClass("hide");
      }
    });
  });
});
