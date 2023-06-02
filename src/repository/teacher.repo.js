const { connection } = require("../config/database.js");

function findAll(search, rating, orderby, callback) {
  if (rating === undefined && orderby === undefined && search === undefined) {
    connection.query("SELECT * FROM guru", function (err, result) {
      if (err) {
        console.log("Something went wrong");
        callback(err, null);
      }
      //  console.log(result);
      callback(null, result);
    });
  } else if (
    rating === undefined &&
    orderby !== undefined &&
    search === undefined
  ) {
    connection.query(
      `SELECT * FROM guru ORDER BY guru.id ${orderby}`,
      function (err, result) {
        if (err) {
          callback(err, null);
        }
        //  console.log(result);
        callback(null, result);
      }
    );
  } else if (
    rating !== undefined &&
    orderby !== undefined &&
    search === undefined
  ) {
    connection.query(
      `SELECT * FROM guru WHERE guru.rating = '${rating}' ORDER BY guru.id ${orderby}`,
      function (err, result) {
        if (err) {
          callback(err, null);
        }
        //  console.log(result);
        callback(null, result);
      }
    );
  } else if (
    rating === undefined &&
    orderby === undefined &&
    search !== undefined
  ) {
    connection.query(
      `SELECT * FROM guru WHERE nama LIKE '%${search}%`,
      function (err, result) {
        if (err) {
          callback(err, null);
        }
        callback(null, result);
      }
    );
  } else if (
    rating === undefined &&
    orderby !== undefined &&
    search !== undefined
  ) {
    connection.query(
      `SELECT * FROM guru WHERE nama LIKE '%${search}%' ORDER BY guru.id ${orderby}`,
      function (err, result) {
        if (err) {
          callback(err, null);
        }
        //  console.log(result);
        callback(null, result);
      }
    );
  } else if (
    rating !== undefined &&
    orderby !== undefined &&
    search !== undefined
  ) {
    connection.query(
      `SELECT * FROM guru WHERE nama LIKE '%${search}%' AND guru.rating = '${rating}' ORDER BY guru.id ${orderby}`,
      function (err, result) {
        if (err) {
          callback(err, null);
        }
        //  console.log(result);
        callback(null, result);
      }
    );
  }
}

function save(body, callback) {
  connection.query(
    `INSERT INTO guru(nama,mengajar,status_guru,rating) VALUES ('${body.nama}', '${body.mengajar}', '${body.status_guru}', '${body.rating}')`,
    function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

function editGuruQuery(id, body, callback) {
  connection.query(
    `UPDATE guru SET nama = '${body.nama}', mengajar = '${body.mengajar}', status_guru = '${body.status_guru}', rating = '${body.rating}' WHERE id = '${id}'`,
    function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

module.exports = { findAll, save, editGuruQuery };
