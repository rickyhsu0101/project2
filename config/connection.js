var mysql = require('mysql');
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE
});
connection.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log('connected as id ' + connection.threadId);
});

export default connection;
