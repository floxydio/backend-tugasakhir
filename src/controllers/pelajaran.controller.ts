import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';

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
    try {
      await prisma.$queryRaw`SELECT kelas.id as kelas_id,guru.id as guru_id,pelajaran.id as pelajaran_id,pelajaran.nama,pelajaran.jam,guru.nama as guru,kelas.nomor as kelas_nomor FROM pelajaran LEFT JOIN guru ON pelajaran.guru_id = guru.id LEFT JOIN kelas ON pelajaran.kelas_id = kelas.id`.then((p) => {
        const successRes = StatusCode.SUCCESS
        return successResponse(res, p, "Successfully GET Pelajaran", successRes)
      })

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
      await prisma.$queryRaw`SELECT kelas.id as kelas_id,guru.id as guru_id,pelajaran.id as pelajaran_id,pelajaran.nama,guru.nama as guru,kelas.nomor as kelas_nomor FROM pelajaran LEFT JOIN guru ON pelajaran.guru_id = guru.id LEFT JOIN kelas ON pelajaran.kelas_id = kelas.id WHERE pelajaran.jadwal = ${week} AND pelajaran.kelas_id = ${kelas}`.then((p) => {
        const successRes = StatusCode.SUCCESS
        return successResponse(res, p, "Successfully GET Pelajaran", successRes)
      })

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }
  }

  /**
 * GET /v2/pelajaran
 * @summary Find All Pelajaran
 * @tags Pelajaran
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - bad request response
 * @return {object} 401 - token expired / not found
 */
  public async findPelajaran(req: Request, res: Response) {
    try {
      await prisma.$queryRaw`SELECT kelas.id as kelas_id,guru.id as guru_id,pelajaran.id as pelajaran_id,pelajaran.nama,guru.nama as guru,kelas.nomor as kelas_nomor, pelajaran.jam FROM pelajaran LEFT JOIN guru ON pelajaran.guru_id = guru.id LEFT JOIN kelas ON pelajaran.kelas_id = kelas.id`.then((p) => {
        const successRes = StatusCode.SUCCESS
        return successResponse(res, p, "Successfully GET Pelajaran", successRes)
      })

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

    try {
      await prisma.pelajaran.create({
        data: {
          nama: nama,
          guru_id: guruId,
          kelas_id: kelasId,
          jadwal: jadwalId,
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
