const { connection } = require("../config/database.js");

function sendAbsence(body, callback) {
  connection.query(
    `INSERT INTO absen(user_id, guru_id, pelajaran_id, kelas_id, keterangan,reason, createdAt) VALUES ('${body.user_id}','${body.guru_id}', '${body.pelajaran_id}','${body.kelas_id}', '${body.keterangan}',${body.reason} ,'${body.createdAt}')`,
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

module.exports = { sendAbsence };
