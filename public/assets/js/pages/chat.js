const events = require('../helper/chat/events');
const socket = io.connect();
import '../../css/chat.css';

//********** CLIENT SIDE CHAT LOGIC *****************/
//********** EMITS EVENTS TO THE SERVER *****************/
//********** SERVER EMITS EVENTS BACK TO THE CLIENT TO EXECUTE LOGIC TO ALL CONNECTED CLIENTS *****************/
//********** SOCKETS ARE CLIENTS ******************/

// creates a new connection
socket.on(events.connection, () => {
  // grabs the room id to connect to the correct room
  var room = $('#send-msg').attr('data-room');
  console.log('connect from room:', room);

  // sends the 'room' event to the client to log the user into their room
  socket.emit(events.room, room);
});

// get message value to emit to all connected clients
$('#send-msg').on('keyup', function(e) {
  if (e.keyCode === 13) {
    // gets the users message, and room to send to the correct room
    const info = {
      room: $('#send-msg').attr('data-room'),
      msg: $(this).val()
    };

    // emits the 'message' event to the server to send to users in the same room
    socket.emit(events.message, info);
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
socket.on(events.message, msg => {
  console.log(msg);
  // var nameSpan = $('span');
  $('.chat-msgs').append(`
    <div class="messages">
      <span>${msg}</span>
    </div>
  `);
});
