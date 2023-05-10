const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();
// create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) {
    console.log("Error connecting to database");
  } else {
    console.log("🔥 Database Connected");
  }
});

module.exports = { connection };
