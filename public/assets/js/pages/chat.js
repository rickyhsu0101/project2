import { headerInit } from '../general/header.js';
import events from '../helper/chat/events';
import '../../css/style.css';
import '../../css/chat.css';

$(document).ready(function() {
  headerInit();

  const socket = io.connect();

  // info about the connected user. Gets sent to the server on each message
  const userObj = {
    name: $('#send-msg').attr('data-name'),
    room: $('#send-msg').attr('data-room'),
    message: null
  };

  // creates a new connection
  socket.on(events.connect, () => {
    // grabs the room id to connect to the correct room

    // sends the 'room' event to the client to log the user into their room
    socket.emit('room', userObj.room);
  });

  // get message value to emit to all connected clients
  $('#send-msg').on('keyup', function(e) {
    if (e.keyCode === 13) {
      userObj.message = $(this).val();

      // emits the 'message' event to the server to send to users in the same room
      socket.emit(events.message, userObj);
      $(this).val('');
      return false;
    }
  });

  // change detects any kind of change to the '#send-msg' element, such as a click
  $('#send-msg').on('change', function() {
    const info = {
      room: $('#send-msg').attr('data-room'),
      value: $('#send-msg').val()
    };

    // emits the 'change' event to the server to show typing message to users in the room
    socket.emit(events.change, info);
  });

  // runs when the the server emits the 'change' event back to the client
  socket.on(events.change, data => {
    // without this, the typing message would get appended each time someone types
    $('#typing').remove();

    // data is the value of the input on the change event
    // if data is '', then the user is not typing, so the message gets removed
    if (data === '') {
      $('#typing').remove();
    } else {
      $('#send-msg').after(`
      <span id="typing">Someone is typing...</span>
    `);
    }
  });

  // runs when the server emits the 'message' event back to the client. Creates a new message to users in the room
  socket.on(events.message, data => {
    // var nameSpan = $('span');
    $('.chat-msgs').append(`
    <div class="messages">
      <span><strong>${data.name}</strong>: </span>
      <span>${data.message}</span>
    </div>
  `);
  });
});
