import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';

import { prisma } from "../config/database"


export class KelasController {
  /**
* GET /v2/kelas
* @summary Find All Kelas
* @tags Kelas
* @param {number} user_id.query.required - guru id
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
  public async findKelas(req: Request, res: Response) {
    const { user_id } = req.query
    try {
      let data = await prisma.kelas.findMany({
        where: {
          guru_id: Number(user_id) ?? undefined
        }
      })
      const successRes = StatusCode.SUCCESS
      return successResponse(res, data, "Successfully GET Kelas", successRes)
    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }
  }
} 