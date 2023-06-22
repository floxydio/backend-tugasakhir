const nilaiRepo = require("../repository/nilai.repo");


function fetchDataKelas(req,res) {
  const {id,semester} = req.params
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

module.exports ={fetchDataKelas,fetchAllData}
