const guruRepo = require("../repository/teacher.repo.js");
const { TeacherEntity } = require("../models/teacher.model.js");

function findAllGuru(req, res) {
  console.log("Teacher Controller Launched 😎");
  guruRepo.findAll(function (err, result) {
    if (err) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: result,
        message: "Successfully Get Guru",
      });
    }
  });
}

function createGuru(req, res) {
  console.log("Teacher Controller Launched 😎");

  const { nama, umur, mengajar, status_guru, rating } = req.body;

  const guru = new TeacherEntity(nama, umur, mengajar, status_guru, rating);
  guruRepo.create(guru, function (err, result) {
    if (err) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    } else {
      return res.status(201).json({
        message: "Successfully Create Guru",
      });
    }
  });
}

module.exports = { findAllGuru, createGuru };
