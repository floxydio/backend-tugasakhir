import { Request, Response } from "express"
import { ResponseModelWithPageTotalResultAndLimit, successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
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
    let { page, limit, user_id } = req.query;

    if (!limit) {
      limit = "5"
    }
    if (!page) {
      page = "1"
    }

    const skip = (Number(page) - 1) * Number(limit);
    const totalData = await prisma.kelas.count();
    const totalPage = Math.ceil(totalData / Number(limit));
    try {
      if (user_id === undefined) {
        let data = await prisma.kelas.findMany({
          include: {
            guru_users: {
              select: {
                nama: true
              }
            }
          },
          take: Number(limit),
          skip: skip
        })
        const successRes = StatusCode.SUCCESS
        let resMessage: ResponseModelWithPageTotalResultAndLimit = {
          status: successRes,
          error: false,
          data: data,
          total_page: totalPage,
          total_result: totalData,
          limit: Number(limit),
          message: "Successfully GET Kelas"
        }
        return successResponse(res, resMessage, "Successfully GET Kelas", successRes)
      } else {
        let data = await prisma.kelas.findMany({
          where: {
            guru_id: Number(user_id)
          },
          include: {
            guru_users: {
              select: {
                nama: true
              }
            }
          },
          take: Number(limit),
          skip: skip
        })
        const successRes = StatusCode.SUCCESS
        let resMessage: ResponseModelWithPageTotalResultAndLimit = {
          status: successRes,
          error: false,
          data: data,
          total_page: totalPage,
          total_result: totalData,
          limit: Number(limit),
          message: "Successfully GET Kelas"
        }
        return successResponse(res, resMessage, "Successfully GET Kelas", successRes)

      }

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }
  }
} 