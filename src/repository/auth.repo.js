const { connection } = require("../config/database.js");

function signIn(body, callback) {
  connection.query(
    `SELECT * FROM users WHERE username = '${body}'`,
    function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

function getUser(callback) {
  connection.query(
    `SELECT users.id,users.nama FROM users WHERE users.status_user = 3`,
    function (err, result) {
      if (err) {
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
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

function editProfile(id, nama, password, notelp, callback) {
  connection.query(
    `UPDATE users SET nama = '${nama}', password = '${password}', notelp = '${notelp}' WHERE id = '${id}'`,
    function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

function signUp(nama, username, password,statususer, userAgent,kelasid, callback) {
  connection.query(
    `INSERT INTO users(nama,username,password,status_user,user_agent,kelas_id) VALUES ('${nama}','${username}', '${password}','${statususer}','${userAgent}','${kelasid}')`,
    function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

function getSiswaByRole(callback) {
  connection.query(`SELECT users.id,users.nama,users.notelp,kelas.nomor, kelas.wali FROM users LEFT JOIN kelas ON users.kelas_id = kelas.id WHERE users.status_user = 3
  `, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  })
}
module.exports = { signUp, signIn, updateUserAgent, getUser, editProfile, getSiswaByRole };
