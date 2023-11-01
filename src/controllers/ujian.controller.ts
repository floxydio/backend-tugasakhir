import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';
import jwt from 'jsonwebtoken'
import { prisma } from "../config/database"

interface SoalPilihanGanda {
    soal: string;
    pilihan: string[];
    jawaban: string;
    isi_pilihan: string[],
}

interface SoalEssay {
    soal: string;
}

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

interface DataSoal {
    pilihan_ganda: PilihanGanda[]
    essay: Essay[]
}

interface PilihanGanda {
    soal: string;
    pilihan: string[],
    jawaban: string
    isi_pilihan: string[],

}

interface Essay {
    soal: string;

}
interface Jawaban {
    pg: string[],
    essay: string[]
}
export class UjianController {
    public async createUjian(req: Request, res: Response) {
        const soal: SoalPilihanGanda[] = req.body.pilihan_ganda;
        const essay: SoalEssay[] = req.body.essay

        await prisma.ujian.create({
            data: {
                nama_ujian: "Ujian Tengah Semester",
                durasi: 60,
                jam_mulai: "05:40",
                mata_pelajaran: 1,
                tanggal: new Date().toISOString(),
                keterangan: "ABC",
                total_soal: 50,
                kelas_id: 1,
                createdAt: new Date().toISOString(),
                soal: JSON.stringify({ pilihan_ganda: soal, essay: essay })
            }
        }).then(() => {
            return successResponseOnlyMessage(res, "Successfully Created", 201)
        })
    }

    public async getAllUjian(req: Request, res: Response) {
        try {
            const data = await prisma.$queryRaw`SELECT ujian.id, ujian.nama_ujian, ujian.tanggal, pelajaran.nama, ujian.jam_mulai,ujian.keterangan,ujian.total_soal, ujian.createdAt FROM ujian LEFT JOIN pelajaran ON pelajaran.id = ujian.mata_pelajaran;
        `
            return successResponse(res, {
                data_ujian: data
            }, "Success Get All Ujian", 200)
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
        const jsonSoal: DataSoal[] = []
        jsonSoal.push(JSON.parse(data!.soal))

        const pgData: PilihanGanda[] = []
        const essayData: Essay[] = []
        for (let i = 0; i < jsonSoal[0].pilihan_ganda.length; i++) {
            const loopPg: PilihanGanda = {
                soal: jsonSoal[0].pilihan_ganda[i].soal,
                pilihan: jsonSoal[0].pilihan_ganda[i].pilihan.toString().replace(/\[|\]/g, "").split(","),
                jawaban: jsonSoal[0].pilihan_ganda[i].jawaban,
                isi_pilihan: jsonSoal[0].pilihan_ganda[i].isi_pilihan.toString().replace(/\[|\]/g, "").split(",")
            }
            pgData.push(loopPg)
        }
        if (jsonSoal[0].essay !== undefined) {
            for (let i = 0; i < jsonSoal[0].essay.length; i++) {

                const loopEssay: Essay = {
                    soal: jsonSoal[0].essay[0].soal
                }

                essayData.push(loopEssay)
            }
        }

        return successResponse(res, {
            soal: {
                pilihan_ganda: pgData,
                // essay: essayData
            }
        }, "Success get detail by id", 200)
    }

    public async createSubmittedExam(req: Request, res: Response) {
        jwt.verify(req.body.token, `${process.env.JWT_TOKEN_SECRET}`, async function (error: any, decoded: any) {
            if (error) {
                const status = StatusCode.BAD_REQUEST
                return failedResponse(res, true, `Something Went Wrong ${error}`, status)
            } else {
                const { jawaban } = req.body
                await prisma.jawaban_user.create({
                    data: {
                        jawaban: JSON.stringify(jawaban),
                        submittedAt: new Date().toISOString(),
                        ujian_id: Number(req.params.idujian),
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
        let countExam = 0
        let countWrong = 0
        try {
            const data = await prisma.ujian.findFirst({
                where: {
                    id: Number(req.params.idujian)
                }
            })

            const dataAnswer = await prisma.jawaban_user.findFirst({
                where: {
                    ujian_id: Number(req.params.idujian)
                }
            })
            const jsonAnswer: Jawaban[] = []
            const jsonSoal: DataSoal[] = []
            jsonSoal.push(JSON.parse(data!.soal))
            jsonAnswer.push(JSON.parse(dataAnswer!.jawaban))

            const pgData: PilihanGanda[] = []

            for (let i = 0; i < jsonSoal[0].pilihan_ganda.length; i++) {
                const loopPg: PilihanGanda = {
                    soal: jsonSoal[0].pilihan_ganda[i].soal,
                    pilihan: jsonSoal[0].pilihan_ganda[i].pilihan.toString().replace(/\[|\]/g, "").split(","),
                    jawaban: jsonSoal[0].pilihan_ganda[i].jawaban,
                    isi_pilihan: jsonSoal[0].pilihan_ganda[i].isi_pilihan.toString().replace(/\[|\]/g, "").split(",")
                }
                pgData.push(loopPg)
            }

            const loopJawaban: Jawaban = {
                pg: jsonAnswer[0].pg,
                essay: []
            }
            for (let i = 0; i < pgData.length; i++) {
                if (pgData[i].jawaban === loopJawaban.pg[i]) {

                    countExam++
                } else if (pgData[i].jawaban !== loopJawaban.pg[i]) {
                    countWrong++
                }
            }
            const status = StatusCode.SUCCESS
            return successResponse(res, {
                jumlah_benar_pg: countExam,
                jumlah_salah_pg: countWrong,
                total_soal_pg: pgData.length
            }, "Get Increment Nilai", status)

        } catch (e) {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
        }
    }

}