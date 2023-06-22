const nilaiRepo = require("../repository/nilai.repo");
const {NilaiEntity} = require("../models/nilai.model");

function fetchDataNilai(req,res) {
  const id = req.query.id
  const semester = req.query.semester
   nilaiRepo.getNilaiByAbsen(semester,id, function(err,result) {
      if (err) {
         return res.status(400).json({
           err: err,
           message: "Something went wrong",
         });
       } else {
         return res.status(200).json({
           status: 200,
           data: result,
           message: "Successfully Get Data",
         });
       }
   })
}


function fetchAllData(req,res) {

    nilaiRepo.getAllDataNilai(function(err,result) {
        if (err) {
          return res.status(400).json({
            err: err,
            message: "Something went wrong",
          });
        } else {
          return res.status(200).json({
            status: 200,
            data: result,
            message: "Successfully Get Data",
          });
        }
    })
}

function createNilai(req,res) {
  const {uts,uas,kelas_id,user_id,semester,pelajaran_id} = req.body
  const data = new NilaiEntity(uts,uas,kelas_id,user_id,semester,pelajaran_id)
    nilaiRepo.createNilai(data,function(err,result) {
        if (err) {
          return res.status(400).json({
            err: err,
            message: "Something went wrong",
          });
        } else {
          return res.status(200).json({
            status: 200,
            data: result,
            message: "Successfully Get Data",
          });
        }
    })
}

module.exports ={fetchDataNilai ,fetchAllData,createNilai}
