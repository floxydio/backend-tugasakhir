import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';

import { prisma } from "../config/database"


export class KelasController {
  public async findKelas(req: Request, res: Response) {
    try {
      let data = await prisma.kelas.findMany()
      const successRes = StatusCode.SUCCESS
      return successResponse(res, data, "Successfully GET Kelas", successRes)
    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, "Something Went Wrong", errorStatus)
    }
  }
}