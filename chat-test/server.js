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

// a socket is a user
// connects a user to a room
io.sockets.on('connection', function(socket) {
  // when the 'room' event is emitted, the user joins their specified room
  socket.on('room', function(room) {
    socket.join(room);
  });

  // emits a message to the room the user connected with
  // each time this event occurs the users room and message is passed in
  socket.on('message', function(data) {
    // this sends the users message to the room they are in
    io.sockets.in(data.room).emit('message', data.msg);
  });

  // listens for a 'change' event to indicate a user is typing
  socket.on('change', function(data) {
    socket.broadcast.to(data.room).emit('change', data.value);
  });
});

http.listen(3000, function() {
  console.log('Listening on localhost:3000');
});
