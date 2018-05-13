// used for chat system
// Declares the types of events the socket will listen for.
// done this way to easily manage the events

module.exports = {
  connection: 'connection',
  message: 'message',
  room: 'room',
  change: 'change'
};
