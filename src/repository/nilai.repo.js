const { connection } = require("../config/database.js");

function getNilaiByAbsen(userid,callback) {
   connection.query(`SELECT * FROM nilai WHERE user_id = ${userid}`,function(err, result) {
      if (err) {
         callback(err, null);
       } else {
         callback(null, result);
       }
   })
}


module.exports = {getNilaiByAbsen}
