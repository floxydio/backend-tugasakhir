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

function updateAbsen(id, body, callback) {
  connection.query(
    `UPDATE absen SET guru_id = '${body.guru_id}', pelajaran_id = '${body.pelajaran_id}', kelas_id = '${body.kelas_id}', keterangan = '${body.keterangan}', reason = '${body.reason}', day = '${body.day}', month = '${body.month}', year ='${body.year}', time = '${body.time}' WHERE id = ${id}`,
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

function getAbsen(orderby, gurunama, month, callback) {
  // Case : Semua nya undefined
  if (gurunama === undefined && orderby === undefined && month === undefined) {
    connection.query(
      `SELECT absen.id, users.nama as nama_user,guru.nama as nama_guru,pelajaran.nama as pelajaran_nama,kelas.nomor as nomor_kelas,absen.keterangan,absen.day,absen.month,absen.year,absen.time,absen.reason FROM absen LEFT JOIN users ON absen.user_id = users.id LEFT JOIN pelajaran ON absen.pelajaran_id = pelajaran.id LEFT JOIN kelas ON absen.kelas_id = kelas.id LEFT JOIN guru ON absen.guru_id = guru.id`,
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      }
    );
    // Case : Guru nama dan month undefined
  } else if (
    gurunama === undefined &&
    month === undefined &&
    orderby !== undefined
  ) {
    connection.query(
      `SELECT absen.id, users.nama as nama_user,guru.nama as nama_guru,pelajaran.nama as pelajaran_nama,kelas.nomor as nomor_kelas,absen.keterangan,absen.day,absen.month,absen.year,absen.time,absen.reason FROM absen LEFT JOIN users ON absen.user_id = users.id LEFT JOIN pelajaran ON absen.pelajaran_id = pelajaran.id LEFT JOIN kelas ON absen.kelas_id = kelas.id LEFT JOIN guru ON absen.guru_id = guru.id ORDER by absen.id ${orderby}`,
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      }
    );
    // Case : Guru undefined
  } else if (
    gurunama === undefined &&
    month !== undefined &&
    orderby !== undefined
  ) {
    connection.query(
      `SELECT absen.id, users.nama as nama_user,guru.nama as nama_guru,pelajaran.nama as pelajaran_nama,kelas.nomor as nomor_kelas,absen.keterangan,absen.day,absen.month,absen.year,absen.time,absen.reason FROM absen LEFT JOIN users ON absen.user_id = users.id LEFT JOIN pelajaran ON absen.pelajaran_id = pelajaran.id LEFT JOIN kelas ON absen.kelas_id = kelas.id LEFT JOIN guru ON absen.guru_id = guru.id WHERE absen.month = '${month}' ORDER by absen.id ${orderby}`,
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      }
    );
  }
}

module.exports = { sendAbsence, getAbsenByUserId, getAbsen, updateAbsen };
