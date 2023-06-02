const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();
// create the connection to database
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  waitForConnections: true,
});

connection.connect(function (err) {
  if (err) {
    console.log(`Error connecting to database ${err}`);
  } else {
    console.log("🔥 Database Connected");
  }
});

module.exports = { connection };
