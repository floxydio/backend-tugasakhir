import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';
import jwt from 'jsonwebtoken'
import { prisma } from "../config/database"


export class UserAnswerController {
    /**
* GET /v2/all-exam
* @summary Find Hasil Ujian by id guru
* @tags Exam
* @param {number} user_id.query.required - User Id
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
    public async getAnswerUser(req: Request, res: Response) {
        try {
            const data = await prisma.jawaban_user.findMany({
                include: {
                    siswa: {
                        select: {
                            nama: true,
                            kelas_id: true,
                            siswa_id: true,
                        }
                    },
                    ujian: {
                        select: {
                            pelajaran: {
                                select: {
                                    nama: true,
                                    pelajaran_id: true,
                                    guru_id: true,
                                }
                            }
                        }
                    },
                },
                where: {
                    ujian: {
                        pelajaran: {
                            guru_id: Number(req.query.user_id) ?? undefined
                        }
                    }
                }

            })
            return successResponse(res, data, "Success Get Jawaban User", StatusCode.SUCCESS)
        } catch (e) {
            return failedResponse(res, true, "Failed Get Jawaban User", StatusCode.BAD_REQUEST)
        }
    }

    /**
* PUT /v2/update-essay/{id}/{user_id}
* @summary Update Nilai Essay by User ID
* @tags Exam
* @param {number} id.path.required - Jawaban User Id
* @param {number} user_id.path.required - User Id
* @param {number} total_benaressay.form.required - form data
* @param {number} total_salahessay.form.required - form data
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
    public async updateNilaiEssay(req: Request, res: Response) {
        const { total_benaressay, total_salahessay } = req.body // Contoh hasil -> 5,  salah -> 3

        const findTotalEssay = await prisma.jawaban_user.findFirst({
            select: {
                jawaban_essay: true,
                total_benar: true,
                total_salah: true
            },
            where: {
                jawaban_user_id: Number(req.params.id),
                siswa_id: Number(req.params.user_id)
            },
        })
        let resultBenar = findTotalEssay?.total_benar + total_benaressay
        let resultSalah = findTotalEssay?.total_salah + total_salahessay

        try {
            await prisma.jawaban_user.updateMany({
                where: {
                    jawaban_user_id: Number(req.params.id),
                    siswa_id: Number(req.params.user_id),
                },
                data: {
                    total_benar: resultBenar,
                    total_salah: resultSalah,
                    log_history: "Selesai Nilai"
                }
            }).then((data) => {
                return successResponse(res, data, "Success Update Nilai Siswa", StatusCode.SUCCESS)
            })

        } catch (err) {
            return failedResponse(res, true, "Failed Update Nilai Siswa", StatusCode.BAD_REQUEST)
        }

    }

}


