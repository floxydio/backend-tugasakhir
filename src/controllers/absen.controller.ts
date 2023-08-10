import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';

import { prisma } from "../config/database"



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
        }
      }).then(() => {
        const successRes = StatusCode.CREATED
        return successResponseOnlyMessage(res, "Successfully Absen", successRes)
      })

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, "Something Went Wrong", errorStatus)

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
      return failedResponse(res, true, "Something Went Wrong", errorStatus)
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
      return failedResponse(res, true, "Something Went Wrong", errorStatus)
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
      return failedResponse(res, true, "Something Went Wrong", errorStatus)

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
      return failedResponse(res, true, "Something Went Wrong", errorStatus)
    }

  }

}

