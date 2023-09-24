import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';

import { prisma } from "../config/database"
export class GuruController {

  public async findAllGuru(req: Request, res: Response) {
    const { search, rating, orderby } = req.query;
    try {
      if (rating === undefined && orderby === undefined && search === undefined) {
        await prisma.guru.findMany().then((g) => {
          const successStatus = StatusCode.SUCCESS
          return successResponse(res, g, "Successfully Get Data Guru", successStatus)
        })
      } else if (rating === undefined &&
        orderby !== undefined &&
        search === undefined) {
        await prisma.guru.findMany({
          orderBy: [
            {
              id: "desc"
            }
          ]
        }).then((g) => {
          const successStatus = StatusCode.SUCCESS
          return successResponse(res, g, "Successfully Get Data Guru", successStatus)
        })
      } else if (rating !== undefined &&
        orderby !== undefined &&
        search === undefined) {
        await prisma.guru.findMany({
          where: {
            rating: Number(rating)
          },
          orderBy: [
            {
              id: "desc"
            }
          ]
        }).then((g) => {
          const successStatus = StatusCode.SUCCESS
          return successResponse(res, g, "Successfully Get Data Guru", successStatus)
        })
      } else if (rating === undefined &&
        orderby === undefined &&
        search !== undefined) {
        await prisma.guru.findMany({
          where: {
            nama: search.toString()
          },
        }).then((g) => {
          const successStatus = StatusCode.SUCCESS
          return successResponse(res, g, "Successfully Get Data Guru", successStatus)
        })
      } else if (rating === undefined &&
        orderby !== undefined &&
        search !== undefined) {
        await prisma.guru.findMany({
          where: {
            nama: search.toString()
          },
          orderBy: [
            {
              id: "desc"
            }
          ]
        }).then((g) => {
          const successStatus = StatusCode.SUCCESS
          return successResponse(res, g, "Successfully Get Data Guru", successStatus)
        })
      } else if (rating !== undefined &&
        orderby !== undefined &&
        search !== undefined) {
        await prisma.guru.findMany({
          where: {
            nama: search.toString(),
            rating: Number(rating)
          },
          orderBy: [
            {
              id: "desc"
            }
          ]
        }).then((g) => {
          const successStatus = StatusCode.SUCCESS
          return successResponse(res, g, "Successfully Get Data Guru", successStatus)
        })
      }
    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }
  }

  public async createGuru(req: Request, res: Response) {
    const { nama, mengajar, rating } = req.body;
    try {
      await prisma.guru.create({
        data: {
          nama: nama,
          mengajar: mengajar,
          status_guru: Number(1),
          rating: rating
        }
      }).then(() => {
        const successStatus = StatusCode.CREATED
        return successResponseOnlyMessage(res, "Successfully Create Guru", successStatus)
      })

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }

  }

  public async editGuru(req: Request, res: Response) {
    const id = req.params.id;
    const { nama, mengajar, status_guru, rating } = req.body;
    try {
      await prisma.guru.update({
        where: {
          id: Number(req.params.id)
        },
        data: {
          nama: nama,
          mengajar: mengajar,
          status_guru: status_guru,
          rating: rating
        }
      }).then(() => {
        const successStatus = StatusCode.SUCCESS
        return successResponseOnlyMessage(res, "Successfully Edit Guru", successStatus)
      })

    } catch (e) {
      const errorStatus = StatusCode.BAD_REQUEST
      return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
    }
  }
}
