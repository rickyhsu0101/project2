const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 's0znzigqvfehvff5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'l7r4ow0c94bi4r8f',
  password: 'v82cpe7cfjqun4e1',
  port: '3306',
  database: 'olqeekbcp7xt59wu'
});
connection.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
