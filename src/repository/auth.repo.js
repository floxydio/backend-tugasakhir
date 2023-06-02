const { connection } = require("../config/database.js");

function signIn(body, callback) {
  connection.query(
    `SELECT * FROM users WHERE username = '${body}'`,
    function (err, result) {
      connection.end();
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

function updateUserAgent(body, username, callback) {
  connection.query(
    `UPDATE users SET user_agent = '${body}' WHERE username ='${username}'`,
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

function signUp(nama, username, password, userAgent, callback) {
  connection.query(
    `INSERT INTO users(nama,username,password,user_agent) VALUES ('${nama}','${username}', '${password}','${userAgent}')`,
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
module.exports = { signUp, signIn, updateUserAgent };
