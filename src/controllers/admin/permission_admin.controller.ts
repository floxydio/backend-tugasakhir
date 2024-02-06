import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../../config/success_res';
import { failedResponse, failedResponseValidation } from '../../config/failed_res';
import StatusCode from '../../config/status_code';

import { prisma } from "../../config/database"
import jwt from "jsonwebtoken"
import Joi from 'joi'


export class PermissionAdminController {


    public async createPermission(req: Request, res: Response) {
        const { permission_name, updated_admin_id } = req.body

        const schema = Joi.object({
            permission_name: Joi.string().required(),
            updated_admin_id: Joi.number().required()
        })

        const { error } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }

        try {
            jwt.verify(req.body.token, `${process.env.JWT_SECRET_ADMIN}`, async (err: any, authData: any) => {
                if (err) {
                    return failedResponse(res, true, "Token is not valid", 403)
                } else {
                    if (authData.data.is_admin === true) {
                        const permission = await prisma.permission.create({
                            data: {
                                permission_name: permission_name,
                                updated_admin_id: updated_admin_id
                            }
                        })

                        return successResponse(res, permission, "Permission Created Successfully", 201)

                    } else {
                        return failedResponse(res, true, "You are not authorized to create permission", 403)
                    }
                }

            })

        } catch (err) {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong: ${err}`, errorStatus)
        }
    }


    public async findPermission(req: Request, res: Response) {
        const { permission_name } = req.query

        if (permission_name === undefined) {
            await prisma.permission.findMany().then((data) => {
                return successResponse(res, data, "Successfully GET Permission", 200)

            }).catch((err) => {
                return failedResponse(res, true, `Something Went Wrong at ${err}`, 400)
            })
        } else {
            await prisma.permission.findMany({
                where: {
                    permission_name: {
                        contains: String(permission_name)
                    }
                }
            }).then((data) => {
                return successResponse(res, data, "Successfully GET Permission", 200)

            }).catch((err) => {
                return failedResponse(res, true, `Something Went Wrong at ${err}`, 400)
            })
        }
    }

    public async updatePermission(req: Request, res: Response) {
        const { permission_name, updated_admin_id } = req.body

        const schema = Joi.object({
            permission_name: Joi.string().required(),
            updated_admin_id: Joi.number().required()
        })

        const { error } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }

        try {
            jwt.verify(req.body.token, `${process.env.JWT_SECRET_ADMIN}`, async (err: any, authData: any) => {
                if (err) {
                    return failedResponse(res, true, "Token is not valid", 403)
                } else {
                    if (authData.data.is_admin === true) {
                        const permission = await prisma.permission.update({
                            where: {
                                id: Number(req.params.id)
                            },
                            data: {
                                permission_name: permission_name,
                                updated_admin_id: updated_admin_id
                            }
                        })

                        return successResponse(res, permission, "Permission Created Successfully", 201)

                    } else {
                        return failedResponse(res, true, "You are not authorized to create permission", 403)
                    }
                }

            })

        } catch (err) {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong: ${err}`, errorStatus)
        }
    }
}