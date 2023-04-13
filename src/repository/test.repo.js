const {connection} = require("../config/database.js");

function getAllData(callback) {
    connection.query("SELECT * FROM test", function(err,result) {
        if (err) {
            callback(err,null)
        }
        callback(null,result)
    })
}

function createTest(body, callback) {
    connection.query(`INSERT INTO test(nama,title,status) VALUES ('${body.nama}','${body.title}','${body.status}')`,function(err,result) {
        if (err) {
            callback(err,null)
        }
        callback(null,result)
    })

}

module.exports = {createTest,getAllData}