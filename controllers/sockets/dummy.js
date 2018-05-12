const path = require('path');
const http = require('http');
const io = require('socket.io');

export function createSocket(app) {
  const io = io(http(app));
  io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('chat message', function(msg) {
      io.emit('chat message', msg);
    });
    socket.on('disconnect', function() {
      console.log('user disconnected');
    });
  });
}

//*******TEST EXPORT FILE FOR SOCKETS */
