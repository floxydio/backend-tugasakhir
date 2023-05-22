const kelarRepo = require("../repository/kelas.repo");

function findKelas(req, res) {
  kelarRepo.findAll(function (err, result) {
    if (err) {
      return res.status(400).json({
        err: err,
        message: "Something Went Wrong",
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: result,
        message: "Successfully Get Data",
      });
    }
  });
}

module.exports = { findKelas };
