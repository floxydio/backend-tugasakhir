import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';
import jwt from 'jsonwebtoken'
import { prisma } from "../config/database"

interface SoalGet {
    id: number;
    nama_ujian: string;
    tanggal: Date;
    mata_pelajaran: number;
    durasi: number;
    jam_mulai: string;
    keterangan: string;
    status_ujian: number;
    total_soal: number;
    kelas_id: number;
    createdAt: Date;
}

interface PilihanGanda {
    id_soal: string
    soal: string
    pilihan: string[][]
    jawaban: string
}

interface Essay {
    id_soal: string
    soal: string
    jawaban: string
}

interface DataSoal {
    pilihan_ganda: PilihanGanda[]
    essay: Essay[]
}
export class UjianController {
    public async createUjian(req: Request, res: Response) {

        await prisma.ujian.create({
            data: {
                nama_ujian: req.body.nama_ujian,
                durasi: Number(req.body.durasi),
                jam_mulai: "05:40",
                mata_pelajaran: 1,
                tanggal: new Date().toISOString(),
                keterangan: "ABC",
                total_soal: Number(req.body.total_soal),
                kelas_id: 1,
                createdAt: new Date().toISOString(),
                soal: JSON.stringify(req.body.soal),
                essay: JSON.stringify(req.body.essay),

            }
        }).then(() => {
            return successResponseOnlyMessage(res, "Successfully Created", 201)
        })
    }


    public async getAllUjian(req: Request, res: Response) {
        try {
            const data = await prisma.$queryRaw`SELECT ujian.id,ujian.kelas_id, ujian.nama_ujian, ujian.tanggal, pelajaran.nama, ujian.jam_mulai,ujian.keterangan,ujian.total_soal, ujian.createdAt FROM ujian LEFT JOIN pelajaran ON pelajaran.id = ujian.mata_pelajaran;
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
            message: "Success get detail by id",
            soal: soal,
            essay: essay
        });
    }

    public async createSubmittedExam(req: Request, res: Response) {
        jwt.verify(req.body.token, `${process.env.JWT_TOKEN_SECRET}`, async function (error: any, decoded: any) {
            if (error) {
                const status = StatusCode.BAD_REQUEST
                return failedResponse(res, true, `Something Went Wrong ${error}`, status)
            } else {
                const { jawaban_pg, jawaban_essay } = req.body
                await prisma.jawaban_user.create({
                    data: {
                        jawaban_pg: JSON.stringify(jawaban_pg),
                        jawaban_essay: JSON.stringify(jawaban_essay),
                        submittedAt: new Date().toISOString(),
                        total_benar: 0,
                        total_salah: 0,
                        ujian_id: Number(req.body.idujian),
                        user_id: decoded.data.id
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

}