const { connection } = require("../config/database.js");

function sendAbsence(body, callback) {
  connection.query(
    `INSERT INTO absen(user_id, guru_id, pelajaran_id, kelas_id, keterangan,reason, day, month, year,time) VALUES ('${body.user_id}','${body.guru_id}', '${body.pelajaran_id}','${body.kelas_id}', '${body.keterangan}','${body.reason}' ,'${body.day}', '${body.month}', '${body.year}', '${body.time}')`,
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

function getAbsenByUserId(id, callback) {
  connection.query(
    `SELECT SUM(absen.keterangan = 'ABSEN') as total_absen, SUM(absen.keterangan = 'IZIN') as total_izin, SUM(absen.keterangan = 'ALPHA') as total_alpha FROM absen WHERE user_id = ${id}`,
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

function getAbsen(callback) {
  connection.query(`SELECT * FROM absen`, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

module.exports = { sendAbsence, getAbsenByUserId, getAbsen };
