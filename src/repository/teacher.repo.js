const { connection } = require("../config/database.js");

function findAll(callback) {
  connection.query("SELECT * FROM guru", function (err, result) {
    if (err) {
      console.log("Something went wrong");
      callback(err, null);
    }
    //  console.log(result);
    callback(null, result);
  });
}

function save(body, callback) {
  connection.query(
    `INSERT INTO guru(nama,mengajar,status_guru,rating) VALUES ('${body.nama}', '${body.mengajar}', '${body.status_guru}', '${body.rating}')`,
    function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

module.exports = { findAll, save };
