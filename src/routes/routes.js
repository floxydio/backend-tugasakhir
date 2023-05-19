const {
  findAllGuru,
  createGuru,
} = require("../controllers/teacher.controller.js");
const {
  signUp,
  signIn,
  getDataJWT,
} = require("../controllers/auth.controller.js");
const {
  sendAbsence,
  getAbsenByUserId,
  getAbsen,
} = require("../controllers/absen.controller.js");
const {
  getFindData,
  insertPelajaran,
  findAllData,
} = require("../controllers/pelajaran.controller.js");

function Routes(app) {
  app.get("/", function (req, res) {
    res.send("Api Running  🚀\n\n\nAsk Dio if have question");
  });

  // Auth --
  app.post("/v1/sign-up", signUp);
  app.post("/v1/sign-in", signIn);
  app.get("/v1/refresh-token", getDataJWT);
  // End Of Auth

  // Guru --
  app.get("/v1/guru", findAllGuru);
  app.post("/v1/guru", createGuru);
  // End Of Guru

  // Absen --
  app.post("/v1/absen", sendAbsence);
  app.get("/v1/absen/:id", getAbsenByUserId);
  app.get("/v1/absen", getAbsen);
  // app.get("/v1/total-absen/:userId/:bulan", getTotalAbsenByMonth);
  // End Of Absen --

  // Pelajaran -
  app.get("/v1/pelajaran", findAllData);
  app.get("/v1/pelajaran/:id/:kelas", getFindData);
  app.post("/v1/create-pelajaran", insertPelajaran);
  // End Of Pelajaran
}

module.exports = { Routes };
