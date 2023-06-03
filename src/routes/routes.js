const {
  findAllGuru,
  createGuru,
  editGuru,
} = require("../controllers/teacher.controller.js");
const {
  signUp,
  signIn,
  getDataJWT,
  getDataUser,
} = require("../controllers/auth.controller.js");
const {
  sendAbsence,
  getAbsenByUserId,
  getAbsen,
  updateAbsen,
} = require("../controllers/absen.controller.js");
const {
  getFindData,
  insertPelajaran,
  findAllData,
  getAllPelajaran,
} = require("../controllers/pelajaran.controller.js");
const { findKelas } = require("../controllers/kelas.controller.js");

function Routes(app) {
  app.get("/", function (req, res) {
    res.send("Api Running  🚀\n\n\nAsk Dio if have question");
  });

  // Auth --
  app.post("/v1/sign-up", signUp);
  app.post("/v1/sign-in", signIn);
  app.get("/v1/refresh-token", getDataJWT);
  app.get("/v1/list-users", getDataUser);
  // End Of Auth

  // Guru --
  app.get("/v1/guru", findAllGuru);
  app.post("/v1/guru", createGuru);
  app.put("/v1/edit-guru/:id", editGuru);
  // End Of Guru

  // Absen --
  app.post("/v1/absen", sendAbsence);
  app.get("/v1/absen/:id/:month", getAbsenByUserId);
  app.get("/v1/absen", getAbsen);
  app.put("/v1/edit-absen/:id", updateAbsen);
  // app.get("/v1/total-absen/:userId/:bulan", getTotalAbsenByMonth);
  // End Of Absen --

  // Pelajaran -
  app.get("/v1/pelajaran", findAllData);
  app.get("/v1/find-pelajaran", getAllPelajaran);
  app.get("/v1/pelajaran/:id/:kelas", getFindData);
  app.post("/v1/create-pelajaran", insertPelajaran);
  // End Of Pelajaran

  // Kelas
  app.get("/v1/kelas", findKelas);
  //End Of Kelas
}

module.exports = { Routes };
