const absenRepo = require("../repository/absen.repo.js");
const { AbsenEntity } = require("../models/absen.model.js");

function sendAbsence(req, res) {
  const {
    user_id,
    guru_id,
    pelajaran_id,
    kelas_id,
    keterangan,
    reason,
    day,
    month,
    year,
    time,
  } = req.body;

  const data = new AbsenEntity(
    user_id,
    guru_id,
    pelajaran_id,
    kelas_id,
    keterangan,
    reason,
    day,
    month,
    year,
    time
  );
  absenRepo.sendAbsence(data, function (err, result) {
    if (err) {
      return res.status(400).json({
        err: err,
        message: "Something Went Wrong",
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "Berhasil Absen",
      });
    }
  });
}

function getAbsenByUserId(req, res) {
  const { id } = req.params;
  absenRepo.getAbsenByUserId(id, function (err, result) {
    if (err) {
      return res.status(400).json({
        err: err,
        message: "Something Went Wrong",
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "Berhasil Get Data",
        data: result,
      });
    }
  });
}

function getAbsen() {
  absenRepo.getAbsen(function (err, result) {
    if (err) {
      return res.status(400).json({
        err: err,
        message: "Something went wrong",
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "Berhasil Get Data",
        data: result,
      });
    }
  });
}

module.exports = { sendAbsence, getAbsenByUserId, getAbsen };
