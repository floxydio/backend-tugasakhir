import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';

import { prisma } from "../config/database"


export class NilaiController {

  public async fetchDataNilai(req: Request, res: Response) {
    const id = req.query.id
    const semester = req.query.semester
    try {
      if (semester === undefined) {
        await prisma.$queryRaw`SELECT nilai.*, pelajaran.nama FROM nilai LEFT JOIN pelajaran ON nilai.pelajaran_id = pelajaran.id WHERE user_id = ${id}`.then((n) => {
          const successRes = StatusCode.SUCCESS
          return successResponse(res, n, "Successfully GET Nilai", successRes)
        })
      } else {
        await prisma.$queryRaw`SELECT nilai.*, pelajaran.nama FROM nilai LEFT JOIN pelajaran ON nilai.pelajaran_id = pelajaran.id WHERE user_id = ${id} AND semester = ${semester}`.then((n) => {
          const successRes = StatusCode.SUCCESS
          return successResponse(res, n, "Successfully GET Nilai", successRes)
        })
      }
    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, "Something Went Wrong", errorStatus)
    }
  }


  public async fetchAllData(req: Request, res: Response) {
    try {
      await prisma.$queryRaw`SELECT users.nama,kelas.nomor,nilai.uts,nilai.uas,nilai.semester, pelajaran.nama as nama_pelajaran FROM nilai LEFT JOIN pelajaran ON nilai.pelajaran_id = pelajaran.id LEFT JOIN kelas ON nilai.kelas_id LEFT JOIN users ON nilai.user_id = users.id`.then((n) => {
        const successRes = StatusCode.SUCCESS
        return successResponse(res, n, "Successfully GET Nilai", successRes)
      })

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, "Something Went Wrong", errorStatus)
    }
  }

  public async createNilai(req: Request, res: Response) {
    const { uts, uas, kelas_id, user_id, semester, pelajaran_id } = req.body
    try {
      await prisma.nilai.create({
        data: {
          uts: Number(uts),
          uas: Number(uas),
          kelas_id: Number(kelas_id),
          user_id: Number(user_id),
          semester: Number(semester),
          pelajaran_id: Number(pelajaran_id)
        }
      }).then(() => {
        const successRes = StatusCode.CREATED
        return successResponseOnlyMessage(res, "Successfully Create Nilai", successRes)
      })
    } catch (e) {

    }

  }
}
