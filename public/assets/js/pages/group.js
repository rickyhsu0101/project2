import { headerInit } from '../general/header.js';

import '../../css/style.css';
import '../../css/group.css';

function updateMembers() {
  $('#membersDiv ul').empty();
  let membersQuery = '/api/group/' + $('#membersDiv').data('group') + '/members';

  $.ajax({
    method: 'GET',
    url: membersQuery
  }).done(function(response) {
    let power = $('#membersDiv').data('power');
    let currentUserId = $('#membersDiv').data('userid');
    if (!response.error) {
      var data = response.data;
      for (var i = 0; i < data[0].length; i++) {
        let memberHTML = $("<li class = 'member row'></li>");
        memberHTML.append(
          "<div class = 'col s8'><a class= 'memberInfo' href = " +
            "'/profile/" +
            data[0][i].userId +
            "' data-id='" +
            data[0][i].userId +
            "'><h6>" +
            data[0][i].username +
            '</h6></a></div>'
        );
        if (power == 'admin') {
          if (data[0][i].userId != currentUserId) {
            memberHTML.append(
              "<a class = 'wave-effect waves-light btn deleteButton' href = '#'>" +
                'Remove' +
                '</a>'
            );
          }
        }
        $('#membersDiv ul').append(memberHTML);
      }
    }
  });
}
function populateComplete(){
  console.log($("#data").data("group"));
  $("#taskPopulate").empty();
  $.ajax({
    method: "GET",
    url: "/api/group/" + $("#data").data("group") + "/tasks"
  }).done(function(response){
    if(!response.error){
      var completedResponse = [];
      response.data.forEach(function(value){
        $.ajax({
          method: "GET",
          async: false,
          url: "/api/group/" + $("#data").data("group") + "/task/" + value.taskId
        }).done(function(response){
          response.data.submissions.forEach(function(value){
            if(value.userId == $("#data").data("user")){
              response.completed = true;
            }else{
              response.completed = false;
            }
          });
          if($("#data").data("power")=="admin"){
            response.admin = true;
          }else{
            response.admin = false;
          }
          completedResponse.push(response);
        });
      });
      console.log("hello");
      var source = $("#taskFrontend").html();
      var template = Handlebars.compile(source);
      var html = template({task: completedResponse});
      console.log(completedResponse);
      console.log(html);
      $("#taskPopulate").append(html);
      $(".collapsible").collapsible();
    }
    
  });
  

}
// <%= group.tasks[k].completedMembers %>
$(document).ready(function() {
  headerInit();
  populateComplete();
  $(".collapsible").collapsible();
  $(".modal").modal();
  
  updateMembers();
  $(document).on("keyup", ".complete-task:focus", function(event){
    console.log("in event");
    if(event.which == 13){
      event.preventDefault();
      const submission = $(this).val();
      $(this).val("");
      let postObj = {
        content: submission
      };
      const userId = $("#data").data("user");
      const groupId = $("#data").data("group");
      const taskId = $(this).data("task");
      console.log(submission);
      console.log(taskId);
      console.log(groupId);
      console.log(userId);
      let query = "/api/group/" + groupId + "/task/" + taskId;
      $.ajax({
        method: "POST",
        url: query,
        data: postObj
      }).done(function(data){
        if(!data.error){
          populateComplete();
        }
      });
    }
  });
  $('#joinGroup').on('click', function(e) {
    e.preventDefault();
    var userId = $(this).data('user');
    var groupId = $(this).data('group');
    var query = '/api/group/' + groupId + '/join/' + userId;
    $.ajax({
      method: 'GET',
      url: query
    }).done(function(data) {
      if (!data.error) {
        $('#joinGroupDiv').addClass('hide');
        updateMembers();
        $('#leaveGroupRow').removeClass('hide');
      }
    });
  });

  $('#avatarChange').on('click', function(e) {
    $('#modalGroup').modal('open');
  });
  $('#new-task').on('click', function(e) {
    $('#modal-task').modal('open');
  });
  $('#leaveGroupButton').on('click', function(e) {
    e.preventDefault();
    var userId = $('#joinGroup').data('user');
    var groupId = $('#joinGroup').data('group');
    var query = "/api/group/" + groupId + "/delete/" + userId;

    $.ajax({
      method: 'DELETE',
      url: query
    }).done(function(data) {
      if (!data.error) {
        $('#leaveGroupRow').addClass('hide');
        $('#joinGroupDiv').removeClass('hide');
        updateMembers();
      }
    });
  });
});
$(document).on('click', '.deleteButton', function(e) {
  e.preventDefault();
  var user = $(this)
    .parent()
    .parent()
    .find('.memberInfo')
    .data('id');
  var group = $('#membersDiv').data('group');
  var query = '/api/group/' + group + '/delete/' + user;
  $.ajax({
    method: 'DELETE',
    url: query
  }).done(function(data) {
    if (!data.error) {
      $('#leaveGroupRow').addClass('hide');
      $('#joinGroupDiv').removeClass('hide');
      updateMembers();
    }
  });
});
