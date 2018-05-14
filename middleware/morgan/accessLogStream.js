const fs = require('fs');
const path = require('path');

// create a write stream to add log entries to access.log.
// the object passed in opens the file for appending, and creates the file if it does not exist
// 'combined' represents the format to write the log. This is the standard apache log format
module.exports = fs.createWriteStream(path.join(__dirname, '../../logs/access.log'), {
  flags: 'a'
});
