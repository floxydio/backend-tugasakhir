import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { prisma } from "../config/database"
import { Request, Response, NextFunction } from "express";
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';
import dotenv from "dotenv"
import multer, { MulterError } from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from "path";

dotenv.config()
export class AuthController {
  public async signIn(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
      const result = await prisma.users.findMany({
        select: {
          id: true,
          nama: true,
          status_role: true,
          password: true,
          kelas_id: true,
          username: true,
        },
        where: {
          username: username
        }
      })
      if (result.length < 0) {
        const status = StatusCode.BAD_REQUEST
        return successResponse(res, [], "Username / Email Tidak Ditemukan", status)
      } else {
        const hash = result[0].password
        const compare = bcrypt.compareSync(password, hash);
        if (compare) {
          const token = jwt.sign(
            {
              data: {
                id: result[0].id,
                nama: result[0].nama,
                role: result[0].status_role,
                kelas_id: result[0].kelas_id,
              },
            },
            `${process.env.JWT_TOKEN_SECRET}`, { expiresIn: '6 days' }
          );
          await prisma.users.update({
            where: {
              username: result[0].username
            },
            data: {
              user_agent: req.headers["user-agent"]
            }
          })
          const successLogin = StatusCode.SUCCESS
          return successResponseOnlyMessageToken(res, token, "Berhasil Login", successLogin)
        }
      }
    } catch (e) {
      const failedRes = StatusCode.INTERNAL_SERVER_ERROR
      return failedResponse(res, true, "Something Went Wrong", failedRes)
    }
  }

  public async editProfile(req: Request, res: Response) {
    const saltRounds = 10;
    const { nama, password, notelp } = req.body;
    const fileUpload = req.file
    const { id } = req.params;
    const uuid = uuidv4()

    if (!fileUpload) {
      if (password !== undefined) {
        try {
          const salt = bcrypt.genSaltSync(saltRounds);
          const hash = bcrypt.hashSync(password, salt);
          await prisma.users.update({
            where: {
              id: Number(id)
            }, data: {
              nama: nama,
              password: hash,
              notelp: notelp,
            }
          }).then(() => {
            const successRes = StatusCode.SUCCESS
            return successResponseOnlyMessage(res, "Sukses Edit Profile", successRes)
          })
        } catch (e) {
          const failedRes = StatusCode.INTERNAL_SERVER_ERROR
          return failedResponse(res, true, "Something Went Wrong", failedRes)
        }
      } else if (password === undefined) {
        try {
          await prisma.users.update({
            where: {
              id: Number(id)
            }, data: {
              nama: nama,
              notelp: notelp,
            }
          }).then(() => {
            const successRes = StatusCode.SUCCESS
            return successResponseOnlyMessage(res, "Sukses Edit Profile", successRes)
          })
        } catch (e) {
          const failedRes = StatusCode.INTERNAL_SERVER_ERROR
          return failedResponse(res, true, "Something Went Wrong", failedRes)
        }
      }
    } else {
      if (password !== undefined) {
        try {
          const salt = bcrypt.genSaltSync(saltRounds);
          const hash = bcrypt.hashSync(password, salt);
          await prisma.users.update({
            where: {
              id: Number(id)
            }, data: {
              nama: nama,
              password: hash,
              notelp: notelp,
              profile_pic: req.file?.filename
            }
          }).then(() => {
            const successRes = StatusCode.SUCCESS
            return successResponseOnlyMessage(res, "Sukses Edit Profile", successRes)
          })
        } catch (e) {
          const failedRes = StatusCode.INTERNAL_SERVER_ERROR
          return failedResponse(res, true, "Something Went Wrong", failedRes)
        }
      } else if (password === undefined) {
        try {
          await prisma.users.update({
            where: {
              id: Number(id)
            }, data: {
              nama: nama,
              notelp: notelp,
              profile_pic: req.file?.filename

            }
          }).then(() => {
            const successRes = StatusCode.SUCCESS
            return successResponseOnlyMessage(res, "Sukses Edit Profile", successRes)
          })
        } catch (e) {
          const failedRes = StatusCode.INTERNAL_SERVER_ERROR
          return failedResponse(res, true, "Something Went Wrong", failedRes)
        }
      }
    }

  }

  public async signUp(req: Request, res: Response) {
    const saltRounds = 10;
    const { nama, username, password, statususer, kelasid } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    try {
      await prisma.users.create({
        data: {
          nama: nama,
          username: username,
          password: hash,
          status_user: Number(0),
          user_agent: req.headers["user-agent"],
          kelas_id: kelasid
        }
      }).then(() => {
        const successRes = StatusCode.CREATED
        return successResponseOnlyMessage(res, "Sukses Registrasi", successRes)
      })

    } catch (e) {
      const failedRes = StatusCode.INTERNAL_SERVER_ERROR
      return failedResponse(res, true, "Something Went Wrong", failedRes)
    }

  }

  public async getUserFromStatusUser(req: Request, res: Response) {
    try {
      const user = await prisma.users.findMany({
        select: {
          id: true,
          nama: true,
          status_user: true,
          status_role: true,
          notelp: true,
          kelas_id: true
        },
        where: {
          status_user: 3
        }
      })
      const successRes = StatusCode.SUCCESS
      return successResponse(res, user, "Successfully Get User Status User 3", successRes)
    } catch (e) {
      const failedRes = StatusCode.INTERNAL_SERVER_ERROR
      return failedResponse(res, true, "Something Went Wrong", failedRes)

    }
  }

  public async getDecodeJWT(req: Request, res: Response) {
    let token = req.headers["x-access-token"];
    if (!token) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, "Token Not Found", errorStatus)
    } else {
      jwt.verify(token.toString(), `${process.env.JWT_TOKEN_SECRET}`, function (err, decoded: any) {
        if (err) {
          const errorStatus = StatusCode.BAD_REQUEST
          return failedResponse(res, true, "Token Not Found", errorStatus)
        } else {
          const successStatus = StatusCode.SUCCESS
          return successResponse(res, decoded.data, "Sukses Get Decode Token", successStatus)
        }
      });
    }

  }
  public async getUserByMurid(req: Request, res: Response) {
    try {
      let data = await prisma.$queryRaw`SELECT users.id,users.nama,users.notelp,kelas.nomor, kelas.wali FROM users LEFT JOIN kelas ON users.kelas_id = kelas.id WHERE users.status_user = 3`
      const successStatus = StatusCode.SUCCESS
      return successResponse(res, data, "Sukses Get User By Murid", successStatus)

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, "Something Went Wrong", errorStatus)

    }
  }


}