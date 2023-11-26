import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';
import jwt from 'jsonwebtoken'
import { prisma } from "../config/database"
import { DataSoal, Essay, PilihanGanda, SoalGet } from "../models/ujian.dto";


export class UjianController {
    public async createUjian(req: Request, res: Response) {

        await prisma.ujian.create({
            data: {
                nama_ujian: req.body.nama_ujian,
                durasi: Number(req.body.durasi),
                jam_mulai: req.body.jam,
                mata_pelajaran: Number(req.body.mapel),
                tanggal: req.body.tanggal,
                keterangan: req.body.keterangan ?? "",
                total_soal: Number(req.body.total_soal),
                kelas_id: 1,
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

    public async updateUjian(req: Request, res: Response) {
        const { id } = req.params
        await prisma.ujian.update({
            where: {
                id: Number(id)
            },
            data: {
                nama_ujian: req.body.nama_ujian,
                durasi: Number(req.body.durasi),
                jam_mulai: req.body.jam,
                mata_pelajaran: Number(req.body.mapel),
                tanggal: req.body.tanggal,
                keterangan: req.body.keterangan ?? "",
                total_soal: Number(req.body.total_soal),
                kelas_id: 1,
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


    public async getAllUjian(req: Request, res: Response) {
        try {
            const data = await prisma.$queryRaw`SELECT ujian.id,ujian.durasi,ujian.kelas_id, ujian.nama_ujian, ujian.tanggal, pelajaran.id as pelajaran_id ,pelajaran.nama, ujian.jam_mulai,ujian.keterangan,ujian.total_soal, ujian.createdAt FROM ujian LEFT JOIN pelajaran ON pelajaran.id = ujian.mata_pelajaran;
        `
            return successResponse(res, data, "Success Get All Ujian", 200)
        } catch (e) {
            return failedResponse(res, true, `Something Went Wrong:${e}`, 400)
        }
    }


    public async getUjian(req: Request, res: Response) {
        const data = await prisma.ujian.findMany({
            where: {
                kelas_id: Number(req.params.id)
            }
        })
        const newData: SoalGet[] = []
        const jsonSoal: DataSoal[] = []
        for (let i = 0; i < data.length; i++) {
            jsonSoal.push(JSON.parse(data[i].soal))
            const soalFromData: SoalGet = {
                id: data[i].id,
                nama_ujian: data[i].nama_ujian,
                createdAt: data[i].createdAt,
                durasi: data[i].durasi,
                jam_mulai: data[i].jam_mulai,
                keterangan: data[i].keterangan,
                mata_pelajaran: data[i].mata_pelajaran,
                status_ujian: data[i].status_ujian,
                tanggal: data[i].tanggal,
                kelas_id: data[i].kelas_id,
                total_soal: data[i].total_soal
            }
            newData.push(soalFromData)
        }

        return successResponse(res, {
            data_ujian: newData,

        }, "Success Get Ujian", 200)
    }

    public async getDetailById(req: Request, res: Response) {
        const data = await prisma.ujian.findFirst({
            where: {
                id: Number(req.params.id)
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
                await prisma.jawaban_user.create({
                    data: {
                        jawaban_pg: JSON.stringify(jawaban_pg),
                        jawaban_essay: JSON.stringify(jawaban_essay),
                        submittedAt: new Date().toISOString(),
                        total_benar: 0,
                        total_salah: 0,
                        ujian_id: Number(req.body.idujian),
                        user_id: decoded.data.id,
                        log_history: JSON.stringify(log)
                    }
                }).then(() => {
                    const status = StatusCode.CREATED
                    return successResponseOnlyMessage(res, "Successfully Submit", status)
                }).catch((e) => {
                    const status = StatusCode.BAD_REQUEST
                    return failedResponse(res, true, `Something Went Wrong ${e}`, status)
                })
            }

        })
    }
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
                    id: Number(req.params.idujian)
                }
            })
            let dataJawaban = await prisma.jawaban_user.findFirst({
                where: {
                    user_id: Number(req.query.iduser),
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
                    id: dataJawaban?.id,
                    user_id: Number(req.query.iduser),
                },
                data: {
                    total_benar: countExamRight,
                    total_salah: soalPilihanGanda.length - countExamRight
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
                        user_id: Number(decoded.data.id),
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
                        id: Number(req.params.id),
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