const { connection } = require("../config/database.js");

function signIn(body, callback) {
  connection.query(
    `SELECT * FROM users WHERE username = '${body}'`,
    function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
        connection.destroy();
      } else {
        callback(null, result);
        connection.destroy();
      }
    }
  );
}

function signUp(nama, username, password, userAgent, callback) {
  connection.query(
    `INSERT INTO users(nama,username,password,user_agent) VALUES ('${nama}','${username}', '${password}','${userAgent}')`,
    function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
        connection.destroy();
      } else {
        callback(null, result);
        connection.destroy();
      }
    }
  );
}
module.exports = { signUp, signIn };
