import express, { Express, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { middlewareAuth } from '../middleware/auth';
import { GuruController } from '../controllers/guru.controller';
import { KelasController } from '../controllers/kelas.controller';
import { NilaiController } from '../controllers/nilai.controller';
import { PelajaranController } from '../controllers/pelajaran.controller';
import { AbsenController } from '../controllers/absen.controller';



export default function Routes(app: Express) {
  app.get("/", function (req, res) {
    res.send("Api Running  🚀\n\n\nAsk Dio if have question");
  });

  // Middleware
  const authMiddleware = new middlewareAuth().authenticatetoken

  // Controller
  const userController = new AuthController()
  const guruController = new GuruController()
  const kelasController = new KelasController()
  const nilaiController = new NilaiController()
  const pelajaranController = new PelajaranController()
  const absenController = new AbsenController()


  // Auth --
  app.post("/v1/sign-up", userController.signUp);
  app.post("/v1/sign-in", userController.signIn);
  app.get("/v1/refresh-token", userController.getDecodeJWT);
  app.get("/v1/list-users", authMiddleware, userController.getUserFromStatusUser);
  app.put("/v1/edit-profile/:id", authMiddleware, userController.editProfile);
  app.get("/v1/siswa-users", userController.getUserByMurid)
  // End Of Auth

  // Guru --
  app.get("/v1/guru", guruController.findAllGuru);
  app.post("/v1/guru", authMiddleware, guruController.createGuru);
  app.put("/v1/edit-guru/:id", authMiddleware, guruController.editGuru);
  // End Of Guru

  // Absen --
  app.post("/v1/absen", authMiddleware, absenController.sendAbsence);
  app.get("/v1/absen/:id/:month", authMiddleware, absenController.getAbsenByUserId);
  app.get("/v1/absen/detail/:id/:month", authMiddleware, absenController.absenDetailByUserIdAndMOnth)
  app.get("/v1/absen", authMiddleware, absenController.getAbsen);
  app.put("/v1/edit-absen/:id", authMiddleware, absenController.updateAbsen);
  // app.get("/v1/total-absen/:userId/:bulan", absenController.getTotalAbsenByMonth);
  // End Of Absen --

  // Pelajaran -
  app.get("/v1/pelajaran", pelajaranController.findPelajaran);
  app.get("/v1/find-pelajaran", pelajaranController.findAllDataPelajaran);
  app.get("/v1/pelajaran/:id/:kelas", authMiddleware, pelajaranController.findAllData);
  app.post("/v1/create-pelajaran", authMiddleware, pelajaranController.insertPelajaran);
  // End Of Pelajaran

  // Nilai
  app.get("/v1/nilai", nilaiController.fetchDataNilai)
  app.get("/v1/nilai-all", nilaiController.fetchAllData)
  app.post("/v1/create-nilai", nilaiController.createNilai)

  // Kelas
  app.get("/v1/kelas", kelasController.findKelas);
  //End Of Kelas
}
