import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../../config/success_res';
import { failedResponse, failedResponseValidation } from '../../config/failed_res';
import StatusCode from '../../config/status_code';

import { prisma } from "../../config/database"
import jwt from "jsonwebtoken"
import Joi from 'joi'
import bcrypt from "bcrypt"


export class AuthAdminController {
    public async signUpAdmin(req: Request, res: Response) {
        const {nama,password,username,access_key} = req.body

        try {
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashPassword = bcrypt.hashSync(password, salt);
            const hashAccessKey = bcrypt.hashSync(access_key, salt);
            await prisma.admin.create({
                data: {
                    nama: nama,
                    user_agent: req.headers["user-agent"] as string,
                    createdAt: new Date(),
                    password: hashPassword,
                    access_key: hashAccessKey,
                    status_user: 1,
                    username: username
                }
            }).then(() => {
                return successResponseOnlyMessage(res,"Successfully Register New Admin", 201)
            })
        } catch(err) {
            return failedResponse(res,true,`Something went wrong ${err}`, 400)
        }
    }

    public async signInAdmin(req: Request, res: Response) {
        const {password,username,access_key} = req.body
        
        try {
            await prisma.admin.findFirst({
                select: {
                    admin_id: true,
                    nama: true,
                    access_key: true,
                    password: true,
                },
                where: {
                    username: username
                }
            }).then((data) => {
                if(data  === null || data === undefined) {
                    const status = StatusCode.BAD_REQUEST
                    return successResponse(res, null, "Username / Email Tidak Ditemukan", status)
                } else {
                    const hashPassword = data.password
                    const hashAcsKy = data.access_key
                    const comparePassword = bcrypt.compareSync(password,hashPassword)
                    const compareAccesKey = bcrypt.compareSync(access_key,hashAcsKy)

                    if(compareAccesKey && comparePassword) {
                        const token = jwt.sign({
                            data: {
                                id: data.admin_id,
                                nama: data.nama,
                                is_admin: true,
                            }
                        }, `${process.env.JWT_SECRET_ADMIN}`,{expiresIn: '2 days'})

                        const successLogin = StatusCode.SUCCESS
                        return successResponseOnlyMessageToken(res, token, "Berhasil Login Admin", successLogin)


                    } else {
                        const status = StatusCode.BAD_REQUEST
                        return failedResponse(res, true, "Password/AccessKey Salah", status)
                    }
                }
            })
        } catch (err) {
            return failedResponse(res,true,`Something went wrong ${err}`, 400)
        }
    

    }
}