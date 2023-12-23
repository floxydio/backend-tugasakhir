import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse, failedResponseValidation } from '../config/failed_res';
import StatusCode from '../config/status_code';

import { prisma } from "../config/database"
import jwt from "jsonwebtoken"
import Joi from 'joi'


export class AbsenController {
  /**
  * POST /v2/absen
  * @summary Create Absen
  * @tags Absen
  * @param {number} user_id.form.required - form data - application/x-www-form-urlencoded
  * @param {number} guru_id.form.required - form data - application/x-www-form-urlencoded
  * @param {number} pelajaran_id.form.required - form data - application/x-www-form-urlencoded
  * @param {number} kelas_id.form.required - form data - application/x-www-form-urlencoded
  * @param {string} keterangan.form.required - form data - application/x-www-form-urlencoded
  * @param {string} reason.form.required - form data - application/x-www-form-urlencoded
  * @param {number} day.form.required - form data - application/x-www-form-urlencoded
  * @param {number} month.form.required - form data - application/x-www-form-urlencoded
  * @param {number} year.form.required - form data - application/x-www-form-urlencoded
  * @param {string} time.form.required - form data - application/x-www-form-urlencoded
  * @param {string} x-access-token.header.required - token
  * @return {object} 201 - success response - application/json
  * @return {object} 400 - bad request response
  * @return {object} 401 - token expired / not found
  */
  public async sendAbsence(req: Request, res: Response) {
    const {
      user_id,
      guru_id,
      pelajaran_id,
      kelas_id,
      keterangan,
      reason,
      day,
      month,
      year,
      time,
    } = req.body;

    const schema = Joi.object().keys({
      user_id: Joi.number().required().messages({
        "any.required": `User Id tidak boleh kosong`,
      }),
      guru_id: Joi.number().required().messages({
        "any.required": `Guru Id tidak boleh kosong`,
      }),
      kelas_Id: Joi.number().required().messages({
        "any.required": `Kelas Id tidak boleh kosong`,
      }),
      keterangan: Joi.string().max(250).required().messages({
        "any.required": `Keterangan tidak boleh kosong`,
        "string.max": "Maksimal keterangan adalah 250 character"
      }),
      reason: Joi.string().required().messages({
        "any.required": `Alasan tidak boleh kosong`,
      }),
      day: Joi.number().required().messages({
        "any.required": `Day tidak boleh kosong`,
      }),
      month: Joi.number().required().messages({
        "any.required": `Bulan tidak boleh kosong`,
      }),
      year: Joi.number().required().messages({
        "any.required": `Tahun tidak boleh kosong`,
      }),
      time: Joi.string().required().messages({
        "any.required": `Waktu tidak boleh kosong`,
      }),
    })
    const { error, value } = schema.validate(req.body)
    if (error !== undefined) {
      return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
    }
    try {
      await prisma.absen.create({
        data: {
          user_id: Number(user_id),
          guru_id: Number(guru_id),
          pelajaran_id: Number(pelajaran_id),
          kelas_id: Number(kelas_id),
          keterangan: keterangan,
          reason: reason,
          day: Number(day),
          month: Number(month),
          year: Number(year),
          time: time
        }
      }).then(() => {
        const successRes = StatusCode.CREATED
        return successResponseOnlyMessage(res, "Successfully Absen", successRes)
      })

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong: ${e}`, errorStatus)

    }

  }
  /**
* GET /v2/absen/{id}/{month}
* @summary Find Absen by ID and Month
* @tags Absen
* @param {number} id.path.required - user id
* @param {number} month.path - bulan (berdasarkan nilai: contoh 1 = januari)
* @param {string} x-access-token.header.required - token
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
  public async getAbsenByUserId(req: Request, res: Response) {
    const { id, month } = req.params;
    try {
      await prisma.$queryRaw`SELECT SUM(absen.keterangan = 'ABSEN') as total_absen, SUM(absen.keterangan = 'IZIN') as total_izin, SUM(absen.keterangan = 'ALPHA') as total_alpha FROM absen WHERE user_id = ${id} AND month = ${month}`.then((c) => {
        const successRes = StatusCode.SUCCESS
        return successResponse(res, c, "Successfully GET Kelas", successRes)
      })

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }

  }

  /**
* GET /v2/absen
* @summary Find Absen for Dashboard
* @tags Absen
* @param {number} search.query - user id
* @param {string} orderby.query.required - enum:desc,asc - urutan
* @param {string} gurunama.query - nama guru
* @param {number} month.query - bulan (berdasarkan nilai: contoh 1 = januari)
* @param {string} x-access-token.header.required - token
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
  public async getAbsen(req: Request, res: Response) {
    const { search, orderby, gurunama, month } = req.query;
    try {
      if (gurunama === undefined && orderby === undefined && month === undefined) {
        await prisma.$queryRaw`SELECT absen.id, users.nama as nama_user,guru.nama as nama_guru,pelajaran.nama as pelajaran_nama,kelas.nomor as nomor_kelas,absen.keterangan,absen.day,absen.month,absen.year,absen.time,absen.reason FROM absen LEFT JOIN users ON absen.user_id = users.id LEFT JOIN pelajaran ON absen.pelajaran_id = pelajaran.id LEFT JOIN kelas ON absen.kelas_id = kelas.id LEFT JOIN guru ON absen.guru_id = guru.id`.then((a) => {
          const successRes = StatusCode.SUCCESS
          return successResponse(res, a, "Successfully GET Absen", successRes)
        })
      } else if (
        gurunama === undefined &&
        month === undefined &&
        orderby !== undefined &&
        search === undefined
      ) {
        await prisma.$queryRaw`SELECT absen.id, users.nama as nama_user,guru.nama as nama_guru,pelajaran.nama as pelajaran_nama,kelas.nomor as nomor_kelas,absen.keterangan,absen.day,absen.month,absen.year,absen.time,absen.reason FROM absen LEFT JOIN users ON absen.user_id = users.id LEFT JOIN pelajaran ON absen.pelajaran_id = pelajaran.id LEFT JOIN kelas ON absen.kelas_id = kelas.id LEFT JOIN guru ON absen.guru_id = guru.id ORDER by absen.id ${orderby}`.then((a) => {
          const successRes = StatusCode.SUCCESS
          return successResponse(res, a, "Successfully GET Absen", successRes)
        })
      } else if (
        gurunama === undefined &&
        month !== undefined &&
        orderby !== undefined
      ) {
        await prisma.$queryRaw`SELECT absen.id, users.nama as nama_user,guru.nama as nama_guru,pelajaran.nama as pelajaran_nama,kelas.nomor as nomor_kelas,absen.keterangan,absen.day,absen.month,absen.year,absen.time,absen.reason FROM absen LEFT JOIN users ON absen.user_id = users.id LEFT JOIN pelajaran ON absen.pelajaran_id = pelajaran.id LEFT JOIN kelas ON absen.kelas_id = kelas.id LEFT JOIN guru ON absen.guru_id = guru.id WHERE absen.month = ${month} ORDER by absen.id ${orderby}`.then((a) => {
          const successRes = StatusCode.SUCCESS
          return successResponse(res, a, "Successfully GET Absen", successRes)
        })
      } else if (
        gurunama === undefined &&
        month === undefined &&
        orderby !== undefined &&
        search !== undefined
      ) {
        await prisma.$queryRaw`SELECT absen.id, users.nama as nama_user,guru.nama as nama_guru,pelajaran.nama as pelajaran_nama,kelas.nomor as nomor_kelas,absen.keterangan,absen.day,absen.month,absen.year,absen.time,absen.reason FROM absen LEFT JOIN users ON absen.user_id = users.id LEFT JOIN pelajaran ON absen.pelajaran_id = pelajaran.id LEFT JOIN kelas ON absen.kelas_id = kelas.id LEFT JOIN guru ON absen.guru_id = guru.id WHERE users.nama LIKE %${search}% ORDER by absen.id ${orderby}`.then((a) => {
          const successRes = StatusCode.SUCCESS
          return successResponse(res, a, "Successfully GET Absen", successRes)
        })
      } else if (
        gurunama === undefined &&
        month !== undefined &&
        orderby !== undefined &&
        search !== undefined
      ) {
        await prisma.$queryRaw`SELECT absen.id, users.nama as nama_user,guru.nama as nama_guru,pelajaran.nama as pelajaran_nama,kelas.nomor as nomor_kelas,absen.keterangan,absen.day,absen.month,absen.year,absen.time,absen.reason FROM absen LEFT JOIN users ON absen.user_id = users.id LEFT JOIN pelajaran ON absen.pelajaran_id = pelajaran.id LEFT JOIN kelas ON absen.kelas_id = kelas.id LEFT JOIN guru ON absen.guru_id = guru.id WHERE absen.month = ${month} AND users.nama LIKE %${search}%  ORDER by absen.id ${orderby}`.then((a) => {
          const successRes = StatusCode.SUCCESS
          return successResponse(res, a, "Successfully GET Absen", successRes)
        })
      }
    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }
  }

  /**
* PUT /v2/edit-absen/{id}
* @summary Update Absen
* @tags Absen
* @param {number} id.path - id
* @param {number} user_id.form.required - form data - application/x-www-form-urlencoded
* @param {number} guru_id.form.required - form data - application/x-www-form-urlencoded
* @param {number} pelajaran_id.form.required - form data - application/x-www-form-urlencoded
* @param {number} kelas_id.form.required - form data - application/x-www-form-urlencoded
* @param {string} keterangan.form.required - form data - application/x-www-form-urlencoded
* @param {string} reason.form.required - form data - application/x-www-form-urlencoded
* @param {number} day.form.required - form data - application/x-www-form-urlencoded
* @param {number} month.form.required - form data - application/x-www-form-urlencoded
* @param {number} year.form.required - form data - application/x-www-form-urlencoded
* @param {string} time.form.required - form data - application/x-www-form-urlencoded
* @param {string} x-access-token.header.required - token
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
  public async updateAbsen(req: Request, res: Response) {
    const id = req.params.id;

    const {
      user_id,
      guru_id,
      pelajaran_id,
      kelas_id,
      keterangan,
      reason,
      day,
      month,
      year,
      time,
    } = req.body;


    const schema = Joi.object().keys({
      user_id: Joi.number().required().messages({
        "any.required": `User Id tidak boleh kosong`,
      }),
      guru_id: Joi.number().required().messages({
        "any.required": `Guru Id tidak boleh kosong`,
      }),
      kelas_Id: Joi.number().required().messages({
        "any.required": `Kelas Id tidak boleh kosong`,
      }),
      keterangan: Joi.string().max(250).required().messages({
        "any.required": `Keterangan tidak boleh kosong`,
        "string.max": "Maksimal keterangan adalah 250 character"
      }),
      reason: Joi.string().required().messages({
        "any.required": `Alasan tidak boleh kosong`,
      }),
      day: Joi.number().required().messages({
        "any.required": `Day tidak boleh kosong`,
      }),
      month: Joi.number().required().messages({
        "any.required": `Bulan tidak boleh kosong`,
      }),
      year: Joi.number().required().messages({
        "any.required": `Tahun tidak boleh kosong`,
      }),
      time: Joi.string().required().messages({
        "any.required": `Waktu tidak boleh kosong`,
      }),
    })
    const { error, value } = schema.validate(req.body)
    if (error !== undefined) {
      return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
    }

    try {
      await prisma.absen.update({
        data: {
          user_id: user_id,
          guru_id: guru_id,
          pelajaran_id: pelajaran_id,
          kelas_id: kelas_id,
          keterangan: keterangan,
          reason: reason,
          day: day,
          month: month,
          year: year,
          time: time
        },
        where: {
          id: Number(id)
        }
      }).then(() => {
        const successRes = StatusCode.SUCCESS
        return successResponseOnlyMessage(res, "Successfully Update Absen", successRes)
      })

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)

    }
  }

  public async absenDetailByUserIdAndMOnth(req: Request, res: Response) {
    const id = req.params.id
    const month = req.params.month

    try {
      await prisma.$queryRaw`SELECT absen.id, users.nama as nama_user,guru.nama as nama_guru,pelajaran.nama as pelajaran_nama,kelas.nomor as nomor_kelas,absen.keterangan,absen.day,absen.month,absen.year,absen.time,absen.reason FROM absen LEFT JOIN users ON absen.user_id = users.id LEFT JOIN pelajaran ON absen.pelajaran_id = pelajaran.id LEFT JOIN kelas ON absen.kelas_id = kelas.nomor LEFT JOIN guru ON absen.guru_id = guru.id WHERE absen.user_id = ${id} AND absen.month = ${month}`.then((a) => {
        const successRes = StatusCode.SUCCESS
        return successResponse(res, a, "Successfully Get Absen", successRes)
      })

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }

  }

  public async absenGuru(req: Request, res: Response) {
    const date = new Date();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const time = `${hours}:${minutes}`;
    try {
      jwt.verify(req.body.token, `${process.env.JWT_TOKEN_SECRET}`, async function (err: any, decode: any) {
        if (err) {
          const status = StatusCode.UNAUTHORIZED
          return failedResponse(res, true, `Something Went Wrong:${err}`, status)

        } else {
          if (decode.data.role === 2) {
            let getLatestAbsen = await prisma.absen_guru.findFirst({
              where: {
                day: new Date().getDate(),
                AND: [{
                  month: new Date().getMonth() + 1,
                  user_id: decode.data.id
                }]
              }
            })
            if (getLatestAbsen?.day === new Date().getDate() && getLatestAbsen?.month === new Date().getMonth() + 1) {
              const status = StatusCode.BAD_REQUEST
              return failedResponse(res, true, "Already Attend", status)
            }
            await prisma.absen_guru.create({
              data: {
                day: new Date().getDate(),
                month: new Date().getMonth() + 1,
                time: time,
                user_id: decode.data.id,
                keterangan: req.body.keterangan,
                year: new Date().getFullYear(),
                sakit_keterangan: req.body.sakit_ket
              }
            }).then(() => {
              const successRes = StatusCode.CREATED
              return successResponseOnlyMessage(res, "Successfully Absen", successRes)
            })
          } else {
            const status = StatusCode.BAD_REQUEST
            return failedResponse(res, true, "Anda Bukanlah Guru", status)
          }
        }
      })
    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)

    }

  }


}

