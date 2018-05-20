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
      console.log(response);
      console.log(response.data);
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
              "<div class = 'col s4'><a class = 'wave-effect waves-light btn deleteButton' href = '#'>" +
                'Remove' +
                '</a></div>'
            );
          }
        }
        $('#membersDiv ul').append(memberHTML);
      }
    }
  });
}
// <%= group.tasks[k].completedMembers %>
$(document).ready(function() {
  headerInit();

  $(".collapsible").collapsible();
  $(".modal").modal();
  
  updateMembers();

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

  $("#avatarChange").on("click", function(e){
    $("#modalGroup").modal('open');
  });
  $("#new-task").on("click", function(e){
    $("#modal-task").modal('open');
  });
  $("#leaveGroupButton").on("click", function(e){
    e.preventDefault();
    var userId = $('#joinGroup').data('user');
    var groupId = $('#joinGroup').data('group');
    console.log(userId);
    console.log(groupId);
    
    var query = "/api/group/" + groupId + "/delete/" + userId;
    console.log(query);

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
  console.log(user);
  console.log(group);
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
