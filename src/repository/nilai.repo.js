const { connection } = require("../config/database.js");

function getNilaiByAbsen(semester,userid,callback) {

   if(semester === undefined) {
      connection.query(`SELECT nilai.*, pelajaran.nama FROM nilai LEFT JOIN pelajaran ON nilai.pelajaran_id = pelajaran.id WHERE user_id = ${userid}`,function(err, result) {
         if (err) {
            callback(err, null);
          } else {
            callback(null, result);
          }
      })
   } else {
      connection.query(`SELECT nilai.*, pelajaran.nama FROM nilai LEFT JOIN pelajaran ON nilai.pelajaran_id = pelajaran.id WHERE user_id = ${userid} AND semester = ${semester}`,function(err, result) {
         if (err) {
            callback(err, null);
          } else {
            callback(null, result);
          }
      })
   }
}

function getAllDataNilai(callback) {
   connection.query(`SELECT users.nama,kelas.nomor,nilai.uts,nilai.uas,nilai.semester, pelajaran.nama FROM nilai LEFT JOIN pelajaran ON nilai.pelajaran_id = pelajaran.id LEFT JOIN kelas ON nilai.kelas_id LEFT JOIN users ON nilai.user_id = users.id`,function(err, result) {
      if (err) {
         callback(err, null);
       } else {
         callback(null, result);
       }
   })
}


module.exports = {getNilaiByAbsen,getAllDataNilai}
