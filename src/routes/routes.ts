import express, { Express, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { middlewareAuth } from '../middleware/auth';



export default function Routes(app: Express) {
  app.get("/", function (req, res) {
    res.send("Api Running  🚀\n\n\nAsk Dio if have question");
  });

  // Middleware
  const authMiddleware = new middlewareAuth().authenticatetoken

  // Controller
  const userController = new AuthController()

  // Auth --
  app.post("/v1/sign-up", userController.signUp);
  app.post("/v1/sign-in", userController.signIn);
  app.get("/v1/refresh-token", userController.getDecodeJWT);
  app.get("/v1/list-users", authMiddleware, userController.getUserFromStatusUser);
  app.put("/v1/edit-profile/:id", authMiddleware, userController.editProfile);
  app.get("/v1/siswa-users", userController.getUserByMurid)
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
  app.get("/v1/nilai", fetchDataNilai)
  app.get("/v1/nilai-all", fetchAllData)
  app.post("/v1/create-nilai", createNilai)

  // Kelas
  app.get("/v1/kelas", findKelas);
  //End Of Kelas
}
