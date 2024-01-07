import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { prisma } from "../config/database"
import { Request, Response, NextFunction } from "express";
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken, successResponseOnlyMessageTokenRole } from '../config/success_res';
import { failedResponse, failedResponseValidation } from '../config/failed_res';
import StatusCode from '../config/status_code';
import dotenv from "dotenv"
import multer, { MulterError } from "multer";
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi'

dotenv.config()
export class AuthController {
  /**
* POST /v2/sign-in
* @summary Sign In User
* @tags Auth
* @param {string} username.form.required - form data - application/x-www-form-urlencoded
* @param {string} password.form.required - form data - application/x-www-form-urlencoded
* @param {string} role.form.required - form data - application/x-www-form-urlencoded
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
  public async signIn(req: Request, res: Response) {

    const { username, password, role } = req.body;
    const schema = Joi.object().keys({
      username: Joi.string().required().messages({
        "string.min": "Username harus memiliki 10 character",
        "any.required": "Username tidak boleh kosong"
      }),
      password: Joi.string().required().messages({
        "any.required": `Password tidak boleh kosong`,

      }),
      role: Joi.number().required().messages({
        "any.required": "Role tidak boleh kosong harus di isi 0/1"
      })
    }).unknown(true)

    const { error, value } = schema.validate(req.body)
    if (error !== undefined) {
      return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
    }

    try {
      const result = await prisma.siswa.findMany({
        select: {
          siswa_id: true,
          nama: true,
          status_user: true,
          password: true,
          kelas_id: true,
          username: true,
        },
        where: {
          username: username,
        }
      })
      if (result.length === 0) {
        const status = StatusCode.BAD_REQUEST
        return successResponse(res, [], "Username / Email Tidak Ditemukan", status)
      } else {
        if (result[0].status_user === 0 || result[0].status_user === 2) {
          const status = StatusCode.BAD_REQUEST
          return failedResponse(res, true, "User Not Active", status)
        } else {
          const hash = result[0].password
          const compare = bcrypt.compareSync(password, hash);
          if (compare) {
            // status_user -> [0: 'not defined', 1: 'aktif', 2: 'non aktif']
            // status_role -> [0: 'not defined', 1: 'siswa', 2: 'guru', 3: 'admin']
            const token = jwt.sign(
              {
                data: {
                  id: result[0].siswa_id,
                  nama: result[0].nama,
                  kelas_id: result[0].kelas_id,
                },
              },
              `${process.env.JWT_TOKEN_SECRET}`, { expiresIn: '6 days' }
            );
            await prisma.siswa.update({
              where: {
                username: result[0].username
              },
              data: {
                user_agent: req.headers["user-agent"]
              }
            })
            const successLogin = StatusCode.SUCCESS
            return successResponseOnlyMessageToken(res, token, "Berhasil Login", successLogin)
          } else {
            const status = StatusCode.BAD_REQUEST
            return failedResponse(res, true, "Password Salah", status)

          }
        }
      }
    } catch (e) {
      const failedRes = StatusCode.INTERNAL_SERVER_ERROR
      return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
    }
  }

  // Sign In Guru
  /**
  * POST /v2/guru/sign-in
  * @summary Sign In Guru User
  * @tags Auth
  * @param {string} username.form.required - form data - application/x-www-form-urlencoded
  * @param {string} password.form.required - form data - application/x-www-form-urlencoded
  * @param {string} role.form.required - form data - application/x-www-form-urlencoded
  * @return {object} 200 - success response - application/json
  * @return {object} 400 - bad request response
  * @return {object} 401 - token expired / not found
  */
  public async signInGuru(req: Request, res: Response) {

    const { username, password } = req.body;
    const schema = Joi.object().keys({
      username: Joi.string().required().messages({
        "string.min": "Username harus memiliki 10 character",
        "any.required": "Username tidak boleh kosong"
      }),
      password: Joi.string().required().messages({
        "any.required": `Password tidak boleh kosong`,
      })
    }).unknown(true)

    const { error, value } = schema.validate(req.body)
    if (error !== undefined) {
      return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
    }

    try {
      const result = await prisma.guru_users.findMany({
        select: {
          guru_id: true,
          nama: true,
          status_user: true,
          password: true,
          username: true,
        },
        where: {
          username: username,
        }
      })
      if (result.length === 0) {
        const status = StatusCode.BAD_REQUEST
        return successResponse(res, [], "Username / Email Tidak Ditemukan", status)
      } else {
        if (result[0].status_user === 0 || result[0].status_user === 2) {
          const status = StatusCode.BAD_REQUEST
          return failedResponse(res, true, "User Not Active", status)
        } else {
          const hash = result[0].password
          const compare = bcrypt.compareSync(password, hash);
          if (compare) {
            const token = jwt.sign(
              {
                data: {
                  id: result[0].guru_id,
                  nama: result[0].nama
                },
              },
              `${process.env.JWT_TOKEN_SECRET}`, { expiresIn: '1 days' }
            );
            await prisma.guru_users.update({
              where: {
                guru_id: result[0].guru_id
              },
              data: {
                user_agent: req.headers["user-agent"]
              }
            })
            const successLogin = StatusCode.SUCCESS

            return res.status(200).json({
              "status": 200,
              "token": token,
              "id": result[0].guru_id,
              "message": "Berhasil Login sebagai guru"
            })
          } else {
            const status = StatusCode.BAD_REQUEST
            return failedResponse(res, true, "Password Salah", status)

          }
        }
      }
    } catch (e) {
      const failedRes = StatusCode.INTERNAL_SERVER_ERROR
      return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
    }
  }


  // Swagger skip
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
          await prisma.siswa.update({
            where: {
              siswa_id: Number(id)
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
          return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
      } else if (password === undefined) {
        try {
          await prisma.siswa.update({
            where: {
              siswa_id: Number(id)
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
          return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
      }
    } else {
      if (password !== undefined) {
        try {
          const salt = bcrypt.genSaltSync(saltRounds);
          const hash = bcrypt.hashSync(password, salt);
          await prisma.siswa.update({
            where: {
              siswa_id: Number(id)
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
          return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
      } else if (password === undefined) {
        try {
          await prisma.siswa.update({
            where: {
              siswa_id: Number(id)
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
          return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
      }
    }

  }
  /**
* POST /v2/sign-up
* @summary Create User / Siswa
* @tags Auth
* @param {string} nama.form.required - form nama - application/x-www-form-urlencoded
* @param {string} username.form.required - form username - application/x-www-form-urlencoded
* @param {string} password.form.required - form password - application/x-www-form-urlencoded
* @return {object} 201 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
  public async signUp(req: Request, res: Response) {
    const { nama, username, password, kelasid, role } = req.body;
    const schema = Joi.object().keys({
      username: Joi.when('role', {
        is: "0", then: Joi.string().min(10).required().messages({
          "string.min": "Username harus memiliki 10 character",
          "any.required": "Username tidak boleh kosong"
        })
      }).when("role", {
        is: "1", then: Joi.string().required().messages({
          "any.required": "Username tidak boleh kosong"
        })
      }),
      nama: Joi.string().required().messages({
        "any.required": "Nama tidak boleh kosong"
      }),
      password: Joi.string().min(6).required().messages({
        "any.required": `Password tidak boleh kosong`,
        "string.min": `Password minimal 6 huruf`
      }),
      role: Joi.required().messages({
        "any.required": "Role tidak boleh kosong harus di isi 0/1"
      })
    })
    const { error, value } = schema.validate(req.body)
    if (error !== undefined) {
      return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    try {
      await prisma.siswa.create({
        data: {
          nama: nama,
          username: username,
          password: hash,
          status_user: Number(1),
          user_agent: req.headers["user-agent"],
          kelas_id: kelasid ?? 0
        }
      }).then(() => {
        const successRes = StatusCode.CREATED
        return successResponseOnlyMessage(res, "Sukses Registrasi", successRes)
      })

    } catch (e) {
      const failedRes = StatusCode.INTERNAL_SERVER_ERROR
      return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
    }

  }


  /**
* POST /v2/guru/sign-up
* @summary Create User Guru
* @tags Auth
* @param {string} nama.form.required - form nama - application/x-www-form-urlencoded
* @param {string} username.form.required - form username - application/x-www-form-urlencoded
* @param {string} password.form.required - form password - application/x-www-form-urlencoded
* @return {object} 201 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
  public async signUpGuru(req: Request, res: Response) {
    const { nama, username, password } = req.body;
    const schema = Joi.object().keys({
      username: Joi.string().required().messages({
        "any.required": "Username tidak boleh kosong"
      }),
      nama: Joi.string().required().messages({
        "any.required": "Nama tidak boleh kosong"
      }),
      password: Joi.string().min(6).required().messages({
        "any.required": `Password tidak boleh kosong`,
        "string.min": `Password minimal 6 huruf`
      }),
    })
    const { error, value } = schema.validate(req.body)
    if (error !== undefined) {
      return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    try {
      await prisma.guru_users.create({
        data: {
          nama: nama,
          username: username,
          password: hash,
          status_user: Number(1),
          user_agent: req.headers["user-agent"],
        }
      }).then(() => {
        const successRes = StatusCode.CREATED
        return successResponseOnlyMessage(res, "Sukses Registrasi", successRes)
      })

    } catch (e) {
      const failedRes = StatusCode.INTERNAL_SERVER_ERROR
      return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
    }

  }

  public async getUserFromStatusUser(req: Request, res: Response) {
    try {
      const user = await prisma.siswa.findMany({
        select: {
          siswa_id: true,
          nama: true,
          status_user: true,
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
      return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)

    }
  }



  /**
  * GET /v2/list-user-guru
  * @summary Find From Role
  * @tags Auth
  * @return {object} 200 - success response - application/json
  * @return {object} 400 - bad request response
  * @return {object} 401 - token expired / not found
  */
  public async getUserFromStatusRole(req: Request, res: Response) {
    try {
      const user = await prisma.guru_users.findMany({
        select: {
          guru_id: true,
          nama: true,
          notelp: true,
        },
      })
      const successRes = StatusCode.SUCCESS
      return successResponse(res, user, "Successfully Get User By Role Guru", successRes)
    } catch (e) {
      const failedRes = StatusCode.INTERNAL_SERVER_ERROR
      return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)

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
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)

    }
  }

  /**
 * GET /v2/profile-image/{token}
 * @summary Find Image By Token
 * @tags Auth
 * @param {string} token.path - token
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - bad request response
 * @return {object} 401 - token expired / not found
 */
  public async getProfileImage(req: Request, res: Response) {
    try {
      jwt.verify(req.params.token, `${process.env.JWT_TOKEN_SECRET}`, async function (err, decode: any) {
        if (err) {
          const errorStatus = StatusCode.BAD_REQUEST
          return failedResponse(res, true, "Token Not Found", errorStatus)
        } else {
          await prisma.siswa.findFirst({
            where: {
              siswa_id: decode.data.id
            },
            select: {
              profile_pic: true,
            }
          }).then((p) => {
            const successStatus = StatusCode.SUCCESS
            return successResponse(res, p, "Sukses Get User By Image", successStatus)
          })
        }
      })
    } catch { }
  }


}