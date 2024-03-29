import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse, failedResponseValidation } from '../config/failed_res';
import StatusCode from '../config/status_code';
import Joi from 'joi'
import { prisma } from "../config/database"

export class PelajaranController {
  /**
 * GET /v2/find-pelajaran
 * @summary Find All Pelajaran
 * @tags Pelajaran
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - bad request response
 * @return {object} 401 - token expired / not found
 */
  public async findAllDataPelajaran(req: Request, res: Response) {
    const { user_id } = req.query

    try {
      const data = await prisma.pelajaran.findMany({
        where: {
          guru_id: Number(user_id) ?? undefined
        },
        select: {
          nama: true,
          jadwal: true,
          jam: true,
          kelas: true,
          users: {
            select: {
              nama: true,
              guru_id: true,
            }
          }
        }
      })
      const successRes = StatusCode.SUCCESS
      return successResponse(res, data, "Successfully GET Pelajaran", successRes)

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }
  }




  /**
* GET /v2/pelajaran/{week}/{kelas}
* @summary Find Pelajaran Day Kelas
* @tags Pelajaran
* @param {string} x-access-token.header.required - token
* @param {number} week.path - hari 1-5
* @param {number} kelas.path - kelas
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
  public async findAllDataWeekKelas(req: Request, res: Response) {
    const { week, kelas } = req.params
    try {
      // await prisma.$queryRaw`SELECT kelas.id as kelas_id,guru.id as guru_id,pelajaran.id as pelajaran_id,pelajaran.nama,guru.nama as guru,kelas.nomor as kelas_nomor FROM pelajaran LEFT JOIN guru ON pelajaran.guru_id = guru.id LEFT JOIN kelas ON pelajaran.kelas_id = kelas.id WHERE pelajaran.jadwal = ${week} AND pelajaran.kelas_id = ${kelas}`.then((p) => {
      //   const successRes = StatusCode.SUCCESS
      //   return successResponse(res, p, "Successfully GET Pelajaran", successRes)
      // })

      const data = await prisma.pelajaran.findMany({
        where: {
          jadwal: Number(week),
          kelas_id: Number(kelas)
        },
        select: {
          pelajaran_id: true,
          nama: true,
          kelas: {
            select: {
              kelas_id: true,
              nomor_kelas: true,

            }
          },
          users: {
            select: {
              guru_id: true,
              nama: true,
            }
          }
        }
      })

      if (data.length === 0) {
        const errorStatus = StatusCode.SUCCESS
        return failedResponse(res, true, `Data Kosong`, errorStatus)
      } else {
        const successRes = StatusCode.SUCCESS
        return successResponse(res, data, "Successfully GET Pelajaran", successRes)
      }


    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }
  }

  /**
 * GET /v2/pelajaran
 * @summary Find All Pelajaran
 * @tags Pelajaran
 * @param {number} user_id.query.required - guru id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - bad request response
 * @return {object} 401 - token expired / not found
 */
  public async findPelajaran(req: Request, res: Response) {
    const { user_id } = req.query

    try {
      // await prisma.$queryRaw`SELECT kelas.id as kelas_id,guru.id as guru_id,pelajaran.id as pelajaran_id,pelajaran.nama,guru.nama as guru,kelas.nomor as kelas_nomor, pelajaran.jam FROM pelajaran LEFT JOIN guru ON pelajaran.guru_id = guru.id LEFT JOIN kelas ON pelajaran.kelas_id = kelas.id`.then((p) => {
      //   const successRes = StatusCode.SUCCESS
      //   return successResponse(res, p, "Successfully GET Pelajaran", successRes)
      // })
      const data = await prisma.pelajaran.findMany({
        where: {
          guru_id: Number(user_id) ?? undefined
        },
        include: {
          users: {
            select: {
              nama: true,
              guru_id: true,

            }
          },
          kelas: {
            select: {
              nomor_kelas: true
            }
          }
        }
      })
      const successRes = StatusCode.SUCCESS
      return successResponse(res, data, "Successfully GET Pelajaran", successRes)
    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }
  }

  /**
* POST /v2/create-pelajaran
* @summary Create Pelajaran
* @tags Pelajaran
* @param {string} nama.form.required - form data - application/x-www-form-urlencoded
* @param {number} guruId.form.required - form data - application/x-www-form-urlencoded
* @param {number} kelasId.form.required - form data - application/x-www-form-urlencoded
* @param {number} jadwalId.form.required - form data - application/x-www-form-urlencoded
* @param {number} jam.form.required - form data - application/x-www-form-urlencoded
* @param {string} x-access-token.header.required - token
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
  public async insertPelajaran(req: Request, res: Response) {
    const { nama, guruId, kelasId, jadwalId, jam, createdAt } = req.body;
    const schema = Joi.object().keys({
      nama: Joi.string().required().messages({
        "any.required": `Nama tidak boleh kosong`,
      }),
      guruId: Joi.number().required().messages({
        "any.required": "Guru ID tidak boleh kosong"
      }),
      kelasId: Joi.number().required().messages({
        "any.required": "Kelas ID tidak boleh kosong"
      }),
      jadwalId: Joi.number().required().messages({
        "any.required": "Jadwal ID tidak boleh kosong"
      }),
      jam: Joi.string().regex(RegExp('^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$')).required().messages({
        "any.required": "Jam tidak boleh kosong",
        "string.pattern.base": "Waktu tidak sesuai - Contoh 17:00"
      })
    }).unknown(true)
    const { error, value } = schema.validate(req.body)
    if (error !== undefined) {
      return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
    }
    try {
      await prisma.pelajaran.create({
        data: {
          nama: nama,
          guru_id: Number(guruId),
          kelas_id: Number(kelasId),
          jadwal: Number(jadwalId),
          jam: jam,
          createdAt: createdAt ?? new Date()
        }
      }).then(() => {
        const successRes = StatusCode.CREATED
        return successResponseOnlyMessage(res, "Successfully Create Pelajaran", successRes)
      })
    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }

  }
}
