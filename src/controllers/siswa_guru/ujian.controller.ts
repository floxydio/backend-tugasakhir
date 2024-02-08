import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../../config/success_res';
import { failedResponse, failedResponseValidation } from '../../config/failed_res';
import StatusCode from '../../config/status_code';
import jwt from 'jsonwebtoken'
import { prisma } from "../../config/database"
import { DataSoal, Essay, PilihanGanda, SoalGet } from "../../models/ujian.dto";
import Joi from 'joi'


export class UjianController {
    /**
* POST /v2/create-ujian
* @summary Create Ujian
* @tags Exam
* @param {string} nama_ujian.form.required - form data
* @param {number} durasi.form.required - form data
* @param {number} jam.form.required - form data
* @param {number} mapel.form.required - form data
* @param {string} tanggal.form.required - form data
* @param {number} total_soal.form.required - form data
* @param {number} kelas_id.form.required - kelas id
* @param {object} soal.form.required - form data
* @param {object} essay.form.required - form data
* @return {object} 201 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
    public async createUjian(req: Request, res: Response) {
        const schema = Joi.object().keys({
            nama_ujian: Joi.string().required().messages({
                "any.required": `Nama Ujian tidak boleh kosong`,
            }),
            durasi: Joi.number().required().messages({
                "any.required": "Durasi tidak boleh kosong"
            }),
            jam: Joi.string().required().messages({
                "any.required": "Jam Mulai tidak boleh kosong"
            }),
            mapel: Joi.number().required().messages({
                "any.required": "Mata Pelajaran ID tidak boleh kosong"
            }),
            tanggal: Joi.string().required().messages({
                "any.required": "Tanggal tidak boleh kosong"
            }),
            keterangan: Joi.string().required().messages({
                "any.required": "Keterangan tidak boleh kosong"
            }),
            total_soal: Joi.number().required().messages({
                "any.required": "Total Soal tidak boleh kosong"
            }),
            kelas_id: Joi.number().required().messages({
                "any.required": "Kelas ID tidak boleh kosong"
            }),
            semester: Joi.number().required().messages({
                "any.required": "Semester tidak boleh kosong"
            })
        }).unknown(true)
        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }
        await prisma.ujian.create({
            data: {
                nama_ujian: req.body.nama_ujian,
                durasi: Number(req.body.durasi),
                jam_mulai: req.body.jam,
                pelajaran_id: Number(req.body.mapel),
                tanggal: req.body.tanggal,
                semester: Number(req.body.semester),
                keterangan: req.body.keterangan,
                total_soal: Number(req.body.total_soal),
                kelas_id: Number(req.body.kelas_id),
                createdAt: new Date().toISOString(),
                soal: JSON.stringify(req.body.soal),
                essay: JSON.stringify(req.body.essay) ?? JSON.stringify([]),

            }
        }).then(() => {
            return successResponseOnlyMessage(res, "Successfully Created", 201)
        }).catch((err) => {
            return failedResponse(res, true, `Something Went Wrong ${err}`, 400)

        })
    }
    /**
* PUT /v2/edit-ujian/{id}
* @summary Edit Ujian
* @tags Exam
* @param {string} id.path - id
* @param {string} nama_ujian.form.required - form data
* @param {number} durasi.form.required - form data
* @param {number} jam.form.required - form data
* @param {number} mapel.form.required - form data
* @param {string} tanggal.form.required - form data
* @param {number} total_soal.form.required - form data
* @param {number} kelas_id.form.required - kelas id
* @param {object} soal.form.required - form data
* @param {object} essay.form.required - form data
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
    public async updateUjian(req: Request, res: Response) {
        const { id } = req.params
        await prisma.ujian.update({
            where: {
                ujian_id: Number(id)
            },
            data: {
                nama_ujian: req.body.nama_ujian,
                durasi: Number(req.body.durasi),
                jam_mulai: req.body.jam,
                pelajaran_id: Number(req.body.mapel),
                tanggal: req.body.tanggal,
                keterangan: req.body.keterangan ?? "",
                total_soal: Number(req.body.total_soal),
                kelas_id: Number(req.body.kelas_id),
                soal: JSON.stringify(req.body.soal),
                essay: JSON.stringify(req.body.essay) ?? JSON.stringify([]),
                updatedAt: new Date().toISOString()

            }
        }).then(() => {
            return successResponseOnlyMessage(res, "Successfully Updated", 201)
        }).catch((err) => {
            return failedResponse(res, true, `Something Went Wrong ${err}`, 400)

        })
    }

    /**
 * GET /v2/all-ujian
 * @summary Find All Ujian
 * @tags Exam
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - bad request response
 * @return {object} 401 - token expired / not found
 */
    public async getAllUjian(req: Request, res: Response) {
        try {
            const data = await prisma.ujian.findMany({
                where: {
                    nama_ujian: req.query.nama_ujian === undefined ? undefined : String(req.query.nama_ujian),
                    kelas: {
                        guru_id: req.query.guru_id === undefined ? undefined : Number(req.query.guru_id)
                    },
                    pelajaran: {
                        guru_id: req.query.guru_id === undefined ? undefined : Number(req.query.guru_id)
                    }
                },
                include: {
                    pelajaran: {
                        select: {
                            guru_id: true,
                            nama: true,
                        }
                    },
                    kelas: true,
                }

            })
            return successResponse(res, data, "Success Get All Ujian", 200)
        } catch (e) {
            return failedResponse(res, true, `Something Went Wrong:${e}`, 400)
        }
    }

    /**
    * GET /v2/ujian/{id}
    * @summary Find Ujian By Detail Kelas
    * @tags Exam
    * @param {string} id.path.required - id
    * @return {object} 200 - success response - application/json
    * @return {object} 400 - bad request response
    * @return {object} 401 - token expired / not found
    */
    public async getUjian(req: Request, res: Response) {
        const data = await prisma.ujian.findMany({
            select: {
                nama_ujian: true,
                tanggal: true,
                ujian_id: true,
                durasi: true,
                jam_mulai: true,
                keterangan: true,
                status_ujian: true,
                total_soal: true,
                pelajaran: {
                    select: {
                        nama: true,
                        guru_id: true
                    }
                }
            },
            where: {
                kelas_id: Number(req.params.id)
            },


        })

        return successResponse(res, data, "Success Get Ujian By Detail", 200)
    }

    /**
* GET /v2/ujian-detail/{id}
* @summary Find Ujian Detail
* @tags Exam
* @param {string} id.path - id
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
    public async getDetailById(req: Request, res: Response) {
        const data = await prisma.ujian.findFirst({
            where: {
                ujian_id: Number(req.params.id)
            }
        })

        let soal = [];
        let essay = [];

        try {
            soal = data?.soal ? JSON.parse(data.soal) : [];
            essay = data?.essay ? JSON.parse(data.essay) : [];
        } catch (error) {
            console.error("Failed to parse 'soal' or 'essay' JSON data", error);
        };
        return res.status(200).json({
            message: "Success get ujian detail by id",
            durasi: data?.durasi,
            nama_ujian: data?.nama_ujian,
            jam_mulai: data?.jam_mulai,
            tanggal: data?.tanggal,
            total_soal: data?.total_soal,
            keterangan: data?.keterangan,
            pelajaran_id: data?.pelajaran_id,
            kelas_id: data?.kelas_id,
            semester: data?.semester,
            soal: soal,
            essay: essay
        });
    }

    public async createSubmittedExam(req: Request, res: Response) {
        if (req.body.token === undefined) {
            const status = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Token is Required`, status)
        }

        jwt.verify(req.body.token, `${process.env.JWT_TOKEN_SECRET}`, async function (error: any, decoded: any) {
            if (error) {
                const status = StatusCode.BAD_REQUEST
                return failedResponse(res, true, `Something Went Wrong ${error}`, status)
            } else {
                const { jawaban_pg, jawaban_essay, log } = req.body
                let questionExam = await prisma.ujian.findFirst({
                    where: {
                        ujian_id: Number(req.body.idujian)
                    }
                })
                let jawabanPGSetStringify = JSON.stringify(jawaban_pg)
                let jawabanPG: string[] = JSON.parse(jawabanPGSetStringify) ?? []
                let soalPilihanGanda: PilihanGanda[] = []
                let countExamRight = 0
                if (questionExam?.soal === undefined || questionExam?.soal === "") {
                    soalPilihanGanda = []
                }
                else {
                    soalPilihanGanda = JSON.parse(questionExam.soal)
                }
                for (let i = 0; i < soalPilihanGanda.length; i++) {
                    if (soalPilihanGanda[i].jawaban === jawabanPG[i]) {
                        countExamRight++
                    }
                }
                await prisma.jawaban_user.create({
                    data: {
                        jawaban_pg: jawabanPGSetStringify,
                        jawaban_essay: JSON.stringify(jawaban_essay),
                        submittedAt: new Date().toISOString(),
                        total_benar: countExamRight,
                        total_salah: soalPilihanGanda.length - countExamRight,
                        ujian_id: Number(req.body.idujian),
                        semester: Number(req.body.semester),
                        siswa_id: decoded.data.id,
                        log_history: log
                    }
                }).then(() => {
                    const status = StatusCode.CREATED
                    return successResponseOnlyMessage(res, "Successfully Submit", status)
                }).catch((e) => {
                    if (e.code === 'P2003') {
                        const status = StatusCode.BAD_REQUEST
                        return failedResponse(res, true, `User Tidak Ditemukan`, status)
                    } else {
                        const status = StatusCode.BAD_REQUEST
                        return failedResponse(res, true, `Something Went Wrong ${e}`, status)
                    }

                })
            }

        })
    }

    /**
* GET /v2/ujian-result/{idujian}
* @summary Find Result Exam By IdUser
* @tags Exam
* @param {number} idujian.path.required - id Ujian
* @param {number} iduser.query.required - id User
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
    public async getResultExam(req: Request, res: Response) {
        if (req.query.iduser === undefined || req.params.idujian === undefined) {
            return failedResponse(res, true, `ID Ujian atau ID User Dibutuhkan`, 400)
        }


        let countExamRight = 0
        let countExamWrong = 0

        let countEssayRight = 0
        let countEssayWrong = 0

        try {
            let questionExam = await prisma.ujian.findFirst({
                where: {
                    ujian_id: Number(req.params.idujian)
                }
            })
            let dataJawaban = await prisma.jawaban_user.findFirst({
                where: {
                    siswa_id: Number(req.query.iduser),
                    ujian_id: Number(req.params.idujian)
                }
            })
            let soalPilihanGanda: PilihanGanda[] = []
            let soalEssay: Essay[] = []
            let jawabanPG: string[] = dataJawaban?.jawaban_pg ? JSON.parse(dataJawaban.jawaban_pg) : []
            let jawabanEssay: string[] = dataJawaban?.jawaban_essay ? JSON.parse(dataJawaban.jawaban_essay) : []
            if (questionExam?.soal === undefined || questionExam?.soal === "") {
                soalPilihanGanda = []
            }
            else {
                soalPilihanGanda = JSON.parse(questionExam.soal)
            }

            if (questionExam?.essay === undefined || questionExam?.essay === "") {
                soalEssay = []
            } else {
                soalEssay = JSON.parse(questionExam.essay)
            }

            for (let i = 0; i < soalPilihanGanda.length; i++) {
                if (soalPilihanGanda[i].jawaban === jawabanPG[i]) {
                    countExamRight++
                }
            }

            await prisma.jawaban_user.update({
                where: {
                    jawaban_user_id: dataJawaban?.jawaban_user_id,
                    siswa_id: Number(req.query.iduser),
                },
                data: {
                    total_benar: countExamRight,
                    total_salah: soalPilihanGanda.length - countExamRight,
                    log_history: 'Selesai'
                }
            })

            return res.status(200).json({
                message: "Success dapat hasil",
                data: {
                    jumlah_benar_pg: countExamRight,
                    jumlah_salah_pg: soalPilihanGanda.length - countExamRight,
                    total_soal_pg: soalPilihanGanda.length
                }
            })
        } catch (e) {
            const status = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong ${e}`, status)
        }
    }

    /**
* GET /v2/exam-result/{userid}
* @summary Find Ujian Result by ID User
* @tags Exam
* @param {string} userid.path.required - id
* @param {number} semester.query - enum:1,2,3,4,5,6 - semester
* @param {string} nama_ujian.query - enum:Ujian Tengah Semester,Ujian Akhir Semester,Ulangan Harian - select type
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
    public async getResultByUserId(req: Request, res: Response) {
        try {
            const data = await prisma.jawaban_user.findMany({
                select: {
                    jawaban_user_id: true,
                    siswa_id: true,
                    ujian_id: true,
                    total_benar: true,
                    total_salah: true,
                    semester: true,
                    log_history: true,
                    ujian: {
                        select: {
                            ujian_id: true,
                            nama_ujian: true,
                            pelajaran: {
                                select: {
                                    nama: true,
                                    pelajaran_id: true,
                                }
                            },
                        }
                    }
                },
                orderBy: {
                    submittedAt: 'desc'
                },
                where: {
                    siswa_id: Number(req.params.userid),

                },
            })
            return res.status(200).json({
                status: 200,
                message: "Succesfully Get Detail Exam",
                data: data
            })

        } catch (e) {
            const status = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong ${e}`, status)
        }

    }

    public async checkUserAlreadyExam(req: Request, res: Response) {
        if (req.query.token === undefined) {
            return failedResponse(res, true, `Token is Required`, 400)
        }

        jwt.verify(req.query.token as string, `${process.env.JWT_TOKEN_SECRET}`, async function (error: any, decoded: any) {
            if (error) {
                return failedResponse(res, true, `Something Went Wrong ${error}`, 400)
            }
            try {
                const data = await prisma.jawaban_user.findFirst({
                    where: {
                        siswa_id: Number(decoded.data.id),
                        ujian_id: Number(req.params.idujian)
                    }
                })

                // True -> Already Exam, False -> Not Yet Exam
                if (data === null) {
                    return res.status(200).json({
                        message: "Succesfully Check Exam",
                        status: false
                    })
                } else {
                    return res.status(200).json({
                        message: "Succesfully Check Exam",
                        status: true
                    })

                }
            } catch (e) {
                const status = StatusCode.BAD_REQUEST
                return failedResponse(res, true, `Something Went Wrong ${e}`, status)
            }
        })

    }

    public async editPilihanGandaAndEssay(req: Request, res: Response) {
        if (req.body.token === undefined) {
            return failedResponse(res, true, `Token is Required`, 400)
        }

        jwt.verify(req.body.token, `${process.env.JWT_TOKEN_SECRET}`, async function (error: any, decoded: any) {
            if (error) {
                return failedResponse(res, true, `Something Went Wrong ${error}`, 400)
            }
            try {
                const data = await prisma.jawaban_user.update({
                    where: {
                        jawaban_user_id: Number(req.params.id),
                    },
                    data: {
                        jawaban_pg: JSON.stringify(req.body.jawaban_pg),
                        jawaban_essay: JSON.stringify(req.body.jawaban_essay)
                    }
                })
                return res.status(200).json({
                    message: "Succesfully Edit Jawaban",
                    data: data
                })
            } catch (e) {
                const status = StatusCode.BAD_REQUEST
                return failedResponse(res, true, `Something Went Wrong ${e}`, status)
            }
        })
    }
}