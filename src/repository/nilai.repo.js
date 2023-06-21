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


module.exports = {getNilaiByAbsen}
