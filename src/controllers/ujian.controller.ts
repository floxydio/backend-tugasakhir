import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';

import { prisma } from "../config/database"

interface SoalPilihanGanda {
    soal: string;
    pilihan: string[];
    jawaban: string;
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
}

interface Essay {
    soal: string;

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
                createdAt: new Date().toISOString(),
                soal: JSON.stringify({ pilihan_ganda: soal, essay: essay })
            }
        }).then(() => {
            return successResponse(res, {
                pilihan_ganda: soal,
                essay: essay
            }, "Empty", 200)
        })
    }


    public async getUjian(req: Request, res: Response) {
        const data = await prisma.ujian.findMany()
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
                total_soal: data[i].total_soal
            }
            newData.push(soalFromData)
        }
        const pgData: PilihanGanda[] = []
        const essayData: Essay[] = []
        const loopPg: PilihanGanda = {
            soal: jsonSoal[0].pilihan_ganda[0].soal,
            pilihan: jsonSoal[0].pilihan_ganda[0].pilihan.toString().replace(/\[|\]/g, "").split(","),
            jawaban: jsonSoal[0].pilihan_ganda[0].jawaban
        }
        const loopEssay: Essay = {
            soal: jsonSoal[0].essay[0].soal
        }
        pgData.push(loopPg)
        essayData.push(loopEssay)
        return successResponse(res, {
            data_ujian: newData,
            soal: {
                pilihan_ganda: pgData,
                essay: essayData
            }
        }, "Empty", 200)
    }

}