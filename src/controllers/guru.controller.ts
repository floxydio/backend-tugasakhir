import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse, failedResponseValidation } from '../config/failed_res';
import StatusCode from '../config/status_code';
import Joi from 'joi'

import { prisma } from "../config/database"
export class GuruController {

  /**
 * GET /v2/guru
 * @summary Find All Guru Data
 * @tags Guru
 * @param {string} search.query - cari berdasarkan nama guru
 * @param {number} rating.query - cari berdasarkan rating guru 1-5
 * @param {string} orderby.query.required - enum:desc,asc - cari dengan urutan
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - bad request response
 */
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
  /**
 * POST /v2/guru
 * @summary Create Guru
 * @tags Guru
 * @param {string} nama.form.required - form data
 * @param {string} mengajar.form.required - form data
 * @param {string} rating.form.required - form data
 * @param {string} x-access-token.header.required - token
 * @return {object} 201 - success response - application/json
 * @return {object} 400 - bad request response
 * @return {object} 401 - token expired / not found
 */
  public async createGuru(req: Request, res: Response) {
    const { nama, mengajar, rating } = req.body;
    const schema = Joi.object().keys({
      nama: Joi.string().required().messages({
        "any.required": `Nama tidak boleh kosong`,

      }),
      mengajar: Joi.string().required().messages({
        "any.required": "Mengajar tidak boleh kosong"
      }),
      status_guru: Joi.number().required().messages({
        "any.required": "Status Guru tidak boleh kosong"
      }),
      rating: Joi.number().required().messages({
        "any.required": "Rating tidak boleh kosong"
      })
    })
    const { error, value } = schema.validate(req.body)
    if (error !== undefined) {
      return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
    }
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
  /**
 * PUT /v2/edit-guru/{id}
 * @summary Edit Guru
 * @tags Guru
 * @param {number} id.path - id
 * @param {string} nama.form.required - form data
 * @param {string} mengajar.form.required - form data
 * @param {string} rating.form.required - form data
 * @param {string} x-access-token.header.required - token
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - bad request response
 * @return {object} 401 - token expired / not found
 */
  public async editGuru(req: Request, res: Response) {
    const id = req.params.id;
    const { nama, mengajar, status_guru, rating } = req.body;
    const schema = Joi.object().keys({
      nama: Joi.string().required().messages({
        "any.required": `Nama tidak boleh kosong`,

      }),
      mengajar: Joi.string().required().messages({
        "any.required": "Mengajar tidak boleh kosong"
      }),
      status_guru: Joi.number().required().messages({
        "any.required": "Status Guru tidak boleh kosong"
      }),
      rating: Joi.number().required().messages({
        "any.required": "Rating tidak boleh kosong"
      })
    })

    const { error, value } = schema.validate(req.body)
    if (error !== undefined) {
      return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
    }
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
