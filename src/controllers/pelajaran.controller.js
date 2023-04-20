const pelajaranRepo = require("../repository/pelajaran.repo.js");

function getFindData(req, res) {
  pelajaranRepo.findAllByQuery(
    req.params.id,
    req.params.kelas,
    function (err, result) {
      if (err) {
        return res.status(400).json({
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

module.exports = { getFindData };
