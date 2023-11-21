import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';
import jwt from 'jsonwebtoken'
import { prisma } from "../config/database"


export class UserAnswerController {
    public async getAnswerUser(req: Request, res: Response) {
        try {
            const data = await prisma.jawaban_user.findMany({

            })
            return successResponse(res, data, "Success Get Jawaban User", StatusCode.SUCCESS)
        } catch (e) {
            console.log(e)
            return failedResponse(res, true, "Failed Get Jawaban User", StatusCode.BAD_REQUEST)
        }
    }

    public async updateNilaiSiswa(req: Request, res: Response) {
        try {
            await prisma.jawaban_user.updateMany({
                where: {
                    id: Number(req.params.id),
                    user_id: Number(req.params.user_id)
                },
                data: {
                    total_benar: Number(req.body.total_benar) ?? 0,
                    total_salah: Number(req.body.total_salah) ?? 0,
                }
            }).then((data) => {
                return successResponse(res, data, "Success Update Nilai Siswa", StatusCode.SUCCESS)
            })

        } catch (err) {
            return failedResponse(res, true, "Failed Update Nilai Siswa", StatusCode.BAD_REQUEST)
        }
    }

}


