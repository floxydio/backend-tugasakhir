const { connection } = require("../config/database.js");

function findAllByQuery(jadwalId, kelasId, callback) {
  connection.query(
    `SELECT pelajaran.nama,guru.nama as guru, kelas.nomor as kelas_nomor FROM pelajaran LEFT JOIN guru ON pelajaran.guru_id = guru.id LEFT JOIN kelas ON pelajaran.kelas_id = kelas.id WHERE pelajaran.jadwal = ${jadwalId} AND pelajaran.kelas_id = ${kelasId}`,
    function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

module.exports = { findAllByQuery };
