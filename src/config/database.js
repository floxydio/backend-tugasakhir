const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tugasakhir",
});

connection.connect(function (err) {
  if (err) {
    console.log("Error connecting to database");
  } else {
    console.log("🔥 Database Connected");
  }
});

module.exports = { connection };
