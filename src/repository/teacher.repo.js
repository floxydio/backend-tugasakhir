const { connection } = require("../config/database.js");

function findAll(callback) {
  connection.query("SELECT * FROM guru", function (err, result) {
    if (err) {
      console.log("Something went wrong");
      callback(err, null);
      connection.destroy();
    }
    //  console.log(result);
    callback(null, result);
    connection.destroy();
  });
}

function save(body, callback) {
  connection.query(
    `INSERT INTO guru(nama,mengajar,status_guru,rating) VALUES ('${body.nama}', '${body.mengajar}', '${body.status_guru}', '${body.status}')`,
    function (err, result) {
      if (err) {
        callback(err, null);
        connection.destroy();
      } else {
        callback(null, result);
        connection.destroy();
      }
    }
  );
}

module.exports = { findAll, save };
