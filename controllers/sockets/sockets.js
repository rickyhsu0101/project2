const events = require('../../public/assets/js/helper/chat/events');

module.exports = function(io) {
  // a socket is a user. connects a user to a room
  return io.sockets.on(events.connection, socket => {
    // when the 'room' event is emitted from the client, the user joins their specified room
    socket.on(events.room, room => socket.join(room));

    // when the 'message' event is emitted from the client, the message gets emitted to all sockets in the room
    // each time this event occurs the users room and message is passed in as the data param
    // sends the users message to all clients in their room
    socket.on(events.message, data => io.sockets.in(data.room).emit(events.message, data.msg));

    // listens for a 'change' event from the client to indicate a user is typing
    // data contains the character pressed, and the users room
    // sends the character to all clients in the room
    socket.on(events.change, data =>
      socket.broadcast.to(data.room).emit(events.change, data.value)
    );
  });
};
