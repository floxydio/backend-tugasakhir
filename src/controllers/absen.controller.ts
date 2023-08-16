import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';

import { prisma } from "../config/database"
import jwt from "jsonwebtoken"


export class AbsenController {

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

