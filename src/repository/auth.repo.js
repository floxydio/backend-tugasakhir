const { connection } = require("../config/database.js");

function signUp(body, callback) {
  connection.query(
    `INSERT INTO users(nama,username,password,user_agent) VALUES ('${body.nama}','${body.username}', '${body.password}','${body.userAgent}')`,
    function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      callback(null, result);
    }
  );
}
module.exports = { signUp };
