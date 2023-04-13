const { connection } = require("../config/database.js");

function signIn(body, callback) {
  console.log(body);
  connection.query(
    `SELECT * FROM users WHERE username = '${body}'`,
    function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

function signUp(body, callback) {
  connection.query(
    `INSERT INTO users(nama,username,password,user_agent) VALUES ('${body.nama}','${body.username}', '${body.password}','${body.userAgent}')`,
    function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}
module.exports = { signUp, signIn };
