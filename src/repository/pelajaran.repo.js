const { connection } = require("../config/database.js");

function findAllByQuery(jadwalId, kelasId, callback) {
  connection.query(
    `SELECT kelas.id as kelas_id,guru.id as guru_id,pelajaran.id as pelajaran_id,pelajaran.nama,guru.nama as guru,kelas.nomor as kelas_nomor FROM pelajaran LEFT JOIN guru ON pelajaran.guru_id = guru.id LEFT JOIN kelas ON pelajaran.kelas_id = kelas.id WHERE pelajaran.jadwal = ${jadwalId} AND pelajaran.kelas_id = ${kelasId}`,
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

function insertPelajaran(nama, guruId, kelasId, jadwalId, createdAt, callback) {
  connection.query(
    `INSERT INTO pelajaran (nama,guru_id,kelas_id,jadwal,createdAt) VALUES ('${nama}','${guruId}','${kelasId}','${jadwalId}','${createdAt}')`,
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

module.exports = { findAllByQuery, insertPelajaran };
