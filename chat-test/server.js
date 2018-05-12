const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', function(req, res) {
  res.sendFile(__dirname + '/test.html');
});

// a socket is a user. connects a user to a room
io.sockets.on('connection', function(socket) {
  // when the 'room' event is emitted from the client, the user joins their specified room
  socket.on('room', function(room) {
    socket.join(room);
  });

  // when the 'message' event is emitted from the client, the message gets emitted to all sockets in the room
  // each time this event occurs the users room and message is passed in as the data param
  socket.on('message', function(data) {
    // sends the users message to all clients in their room
    io.sockets.in(data.room).emit('message', data.msg);
  });

  // listens for a 'change' event from the client to indicate a user is typing
  // data contains the character pressed, and the users room
  socket.on('change', function(data) {
    // sends the character to all clients in the room
    socket.broadcast.to(data.room).emit('change', data.value);
  });
});

http.listen(3000, function() {
  console.log('Listening on localhost:3000');
});
