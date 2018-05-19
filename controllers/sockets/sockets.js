const events = require('../../public/assets/js/helper/chat/events');
const groupChat = require('../../models/chat');

module.exports = function(io) {
  // a socket is a user. connects a user to a room
  return io.sockets.on(events.connection, socket => {
    // when the 'room' event is emitted from the client, the user joins their specified room
    socket.on(events.room, room => {
      socket.join(room);
    });

    // when the 'message' event is emitted from the client, the message gets emitted to all sockets in the room
    // each time this event occurs the users room, name, and message is passed in as the data param
    socket.on(events.message, data => {
      console.log(data);

      // saves each message to the chat table for the group
      groupChat.postMessage(data, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });

      // sends the users message to all clients in their room
      io.sockets.in(data.room).emit(events.message, data);
    });

    // listens for a 'change' event from the client to indicate a user is typing
    // data contains the character pressed, and the users room
    // sends the character to all clients in the room
    socket.on(events.change, data =>
      socket.broadcast.to(data.room).emit(events.change, data.value)
    );
  });
};
