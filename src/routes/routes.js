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
  editProfile,
  getUserByMurid,
} = require("../controllers/auth.controller.js");
const {
  sendAbsence,
  getAbsenByUserId,
  getAbsen,
  updateAbsen,
  absenDetailByUserIdAndMOnth,
} = require("../controllers/absen.controller.js");
const {
  getFindData,
  insertPelajaran,
  findAllData,
  getAllPelajaran,
} = require("../controllers/pelajaran.controller.js");
const { findKelas } = require("../controllers/kelas.controller.js");
const authMiddleware = require("../middleware/auth.js");
const { fetchDataKelas, fetchAllData } = require("../controllers/nilai.controller.js");

function Routes(app) {
  app.get("/", function (req, res) {
    res.send("Api Running  🚀\n\n\nAsk Dio if have question");
  });

  // Auth --
  app.post("/v1/sign-up", signUp);
  app.post("/v1/sign-in", signIn);
  app.get("/v1/refresh-token", getDataJWT);
  app.get("/v1/list-users", authMiddleware, getDataUser);
  app.put("/v1/edit-profile/:id", authMiddleware, editProfile);
  app.get("/v1/siswa-users", getUserByMurid)
  // End Of Auth

  // Guru --
  app.get("/v1/guru", findAllGuru);
  app.post("/v1/guru", authMiddleware, createGuru);
  app.put("/v1/edit-guru/:id", authMiddleware, editGuru);
  // End Of Guru

  // Absen --
  app.post("/v1/absen", authMiddleware, sendAbsence);
  app.get("/v1/absen/:id/:month", authMiddleware, getAbsenByUserId);
  app.get("/v1/absen/detail/:id/:month", authMiddleware, absenDetailByUserIdAndMOnth)
  app.get("/v1/absen", authMiddleware, getAbsen);
  app.put("/v1/edit-absen/:id", authMiddleware, updateAbsen);
  // app.get("/v1/total-absen/:userId/:bulan", getTotalAbsenByMonth);
  // End Of Absen --

  // Pelajaran -
  app.get("/v1/pelajaran", findAllData);
  app.get("/v1/find-pelajaran", getAllPelajaran);
  app.get("/v1/pelajaran/:id/:kelas", authMiddleware, getFindData);
  app.post("/v1/create-pelajaran", authMiddleware, insertPelajaran);
  // End Of Pelajaran

  // Nilai
  app.get("/v1/nilai", authMiddleware,fetchDataKelas)
  app.get("/v1/nilai-all",fetchAllData)

  // Kelas
  app.get("/v1/kelas", findKelas);
  //End Of Kelas
}

module.exports = { Routes };
