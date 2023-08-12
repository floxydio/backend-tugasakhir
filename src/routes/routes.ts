import express, { Express, NextFunction, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { middlewareAuth } from '../middleware/auth';
import { GuruController } from '../controllers/guru.controller';
import { KelasController } from '../controllers/kelas.controller';
import { NilaiController } from '../controllers/nilai.controller';
import { PelajaranController } from '../controllers/pelajaran.controller';
import { AbsenController } from '../controllers/absen.controller';
import multer from "multer"
import { v4 as uuidv4 } from 'uuid';
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/storage/profile')
  },
  filename: function (req, file, cb) {
    const uuid = uuidv4()
    cb(null, uuid + path.extname(file.originalname))
  },

})

const upload = multer({
  storage: storage, limits: { fileSize: 1 * 1024 * 1024 }, // 3MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else if (!mimetype) {
      return cb(new Error('Unsupported file type. Please upload a JPEG or PNG file.'));
    } else if (!extname) {
      return cb(new Error('File extension does not match the file type. Please upload a valid JPEG or PNG file.'));
    } else {
      return cb(new Error('Something went wrong. Please try again.'));
    }
  }
})

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

  // Static
  app.use("/img-profile", express.static("src/storage/profile"))

  // Auth --
  app.post("/v2/sign-up", userController.signUp);
  app.post("/v2/sign-in", userController.signIn);
  app.get("/v2/refresh-token", userController.getDecodeJWT);
  app.get("/v2/list-users", authMiddleware, userController.getUserFromStatusUser);
  app.get("/v2/profile-image/token", authMiddleware, userController.getProfileImage)
  app.put("/v2/edit-profile/:id", authMiddleware, upload.single("profile"), userController.editProfile, (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.message
      })
    }
    next();
  });
  app.get("/v2/siswa-users", userController.getUserByMurid)
  // End Of Auth

  // Guru --
  app.get("/v2/guru", guruController.findAllGuru);
  app.post("/v2/guru", authMiddleware, guruController.createGuru);
  app.put("/v2/edit-guru/:id", authMiddleware, guruController.editGuru);
  // End Of Guru

  // Absen --
  app.post("/v2/absen", authMiddleware, absenController.sendAbsence);
  app.get("/v2/absen/:id/:month", authMiddleware, absenController.getAbsenByUserId);
  app.get("/v2/absen/detail/:id/:month", authMiddleware, absenController.absenDetailByUserIdAndMOnth)
  app.get("/v2/absen", authMiddleware, absenController.getAbsen);
  app.put("/v2/edit-absen/:id", authMiddleware, absenController.updateAbsen);
  // app.get("/v2/total-absen/:userId/:bulan", absenController.getTotalAbsenByMonth);
  // End Of Absen --

  // Pelajaran -
  app.get("/v2/pelajaran", pelajaranController.findPelajaran);
  app.get("/v2/find-pelajaran", pelajaranController.findAllDataPelajaran);
  app.get("/v2/pelajaran/:id/:kelas", authMiddleware, pelajaranController.findAllData);
  app.post("/v2/create-pelajaran", authMiddleware, pelajaranController.insertPelajaran);
  // End Of Pelajaran

  // Nilai
  app.get("/v2/nilai", nilaiController.fetchDataNilai)
  app.get("/v2/nilai-all", nilaiController.fetchAllData)
  app.post("/v2/create-nilai", nilaiController.createNilai)

  // Kelas
  app.get("/v2/kelas", kelasController.findKelas);
  //End Of Kelas
}
