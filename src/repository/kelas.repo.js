const { connection } = require("../config/database");

function findAll(callback) {
  connection.query("SELECT * FROM kelas", function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

module.exports = { findAll };
