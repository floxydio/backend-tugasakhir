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
   connection.query(`SELECT users.nama,kelas.nomor,nilai.uts,nilai.uas,nilai.semester, pelajaran.nama as nama_pelajaran FROM nilai LEFT JOIN pelajaran ON nilai.pelajaran_id = pelajaran.id LEFT JOIN kelas ON nilai.kelas_id LEFT JOIN users ON nilai.user_id = users.id`,function(err, result) {
      if (err) {
         callback(err, null);
       } else {
         callback(null, result);
       }
   })
}

function createNilai(data,callback) {
   connection.query(`INSERT INTO nilai (uts,uas,kelas_id,user_id,semester,pelajaran_id) VALUES ('${data.uts}', '${data.uas}','${data.kelas_id}','${data.user_id}', '${data.semester}', '${data.pelajaran_id}')`,data,function(err, result) {
      if (err) {
         callback(err, null);
       } else {
         callback(null, result);
       }
   })
}


module.exports = {getNilaiByAbsen,getAllDataNilai,createNilai}
