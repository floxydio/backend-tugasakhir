const pelajaranRepo = require("../repository/pelajaran.repo.js");

function findAllData(req, res) {
  pelajaranRepo.findByAll(function (err, result) {
    if (err) {
      return res.status(400).json({
        err: err,
        message: "Something Went Wrong",
      });
    } else {
      if (result.length === 0) {
        return res.status(200).json({
          data: [],
          message: "Jadwal Tidak Ditemukan",
        });
      } else {
        return res.status(200).json({
          status: 200,
          data: result,
          message: "Successfully Get Data",
        });
      }
    }
  });
}

function getFindData(req, res) {
  pelajaranRepo.findAllByQuery(
    req.params.id,
    req.params.kelas,
    function (err, result) {
      if (err) {
        return res.status(400).json({
          err: err,
          message: "Something Went Wrong",
        });
      } else {
        if (result.length === 0) {
          return res.status(200).json({
            data: [],
            message: "Jadwal Tidak Ditemukan",
          });
        } else {
          return res.status(200).json({
            status: 200,
            data: result,
            message: "Successfully Get Data",
          });
        }
      }
    }
  );
}

function getAllPelajaran(req, res) {
  pelajaranRepo.find(function (err, result) {
    if (err) {
      return res.status(400).json({
        err: err,
        message: "Something went wrong",
      });
    } else {
      return res.status(201).json({
        status: 200,
        data: result,
        message: "Successfully Get Data",
      });
    }
  });
}

function insertPelajaran(req, res) {
  const { nama, guruId, kelasId, jadwalId,jam,createdAt } = req.body;

  pelajaranRepo.insertPelajaran(
    nama,
    guruId,
    kelasId,
    jadwalId,
    jam,
    createdAt,
    function (err, result) {
      if (err) {
        return res.status(400).json({
          err: err,
          message: "Something went wrong",
        });
      } else {
        return res.status(201).json({
          message: "Successfully Create Pelajaran",
        });
      }
    }
  );
}

module.exports = { getFindData, insertPelajaran, findAllData, getAllPelajaran };
