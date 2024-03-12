
import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse, failedResponseValidation } from '../config/failed_res';
import StatusCode from '../config/status_code';
import bcrypt from "bcrypt"
import { prisma } from "../config/database"
import jwt from "jsonwebtoken"
import Joi from 'joi'


export class AdminControllerAuth {

    public async signIn(req: Request, res: Response) {

        const { username, password, role } = req.body;
        const schema = Joi.object().keys({
            username: Joi.string().required().messages({
                "string.min": "Username harus memiliki 10 character",
                "any.required": "Username tidak boleh kosong"
            }),
            password: Joi.string().required().messages({
                "any.required": `Password tidak boleh kosong`,

            }),
        }).unknown(true)

        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }

        try {
            const result = await prisma.admin_users.findMany({
                select: {
                    admin_id: true,
                    nama: true,
                    password: true,
                    username: true,
                },
                where: {
                    username: username,
                }
            })
            if (result.length === 0) {
                const status = StatusCode.BAD_REQUEST
                return successResponse(res, [], "Username / Email Tidak Ditemukan", status)
            } else {
                const hash = result[0].password
                const compare = bcrypt.compareSync(password, hash);
                if (compare) {
                    // status_user -> [0: 'not defined', 1: 'aktif', 2: 'non aktif']
                    // status_role -> [0: 'not defined', 1: 'siswa', 2: 'guru', 3: 'admin']
                    const token = jwt.sign(
                        {
                            data: {
                                id: result[0].admin_id,
                                nama: result[0].nama,
                                role: "admin"
                            },
                        },
                        `${process.env.JWT_TOKEN_SECRET}`, { expiresIn: '6 days' }
                    );
                    await prisma.admin_users.update({
                        where: {
                            admin_id: result[0].admin_id
                        },
                        data: {
                            user_agent: req.headers["user-agent"]
                        }
                    })
                    const successLogin = StatusCode.SUCCESS
                    return successResponseOnlyMessageToken(res, result[0].admin_id, token, "Berhasil Login", successLogin)
                } else {
                    const status = StatusCode.BAD_REQUEST
                    return failedResponse(res, true, "Password Salah", status)

                }
            }
        } catch (e) {
            const failedRes = StatusCode.INTERNAL_SERVER_ERROR
            return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
    }
    public async daftarAdmin(req: Request, res: Response) {
        const { nama, username, password } = req.body;
        const schema = Joi.object().keys({
            username: Joi.string().required().messages({
                "any.required": "Username tidak boleh kosong"
            }),
            nama: Joi.string().required().messages({
                "any.required": "Nama tidak boleh kosong"
            }),
            password: Joi.string().min(6).required().messages({
                "any.required": `Password tidak boleh kosong`,
                "string.min": `Password minimal 6 huruf`
            }),
        })
        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        try {
            await prisma.admin_users.create({
                data: {
                    nama: nama,
                    username: username,
                    password: hash,
                    user_agent: req.headers["user-agent"],
                }
            }).then(() => {
                const successRes = StatusCode.CREATED
                return successResponseOnlyMessage(res, "Sukses Registrasi", successRes)
            })

        } catch (e) {
            const failedRes = StatusCode.INTERNAL_SERVER_ERROR
            return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
    }


    /**
* POST /v2/admin/guru
* @summary Create Guru From Admin
* @tags Guru
* @param {string} nama.form.required - form data
* @param {string} mengajar.form.required - form data
* @param {string} rating.form.required - form data
* @param {string} x-access-token.header.required - token
* @return {object} 201 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
    public async daftarGuruBaru(req: Request, res: Response) {
        const { nama, username, password } = req.body;
        const schema = Joi.object().keys({
            username: Joi.string().required().messages({
                "any.required": "Username tidak boleh kosong"
            }),
            nama: Joi.string().required().messages({
                "any.required": "Nama tidak boleh kosong"
            }),
            password: Joi.string().min(6).required().messages({
                "any.required": `Password tidak boleh kosong`,
                "string.min": `Password minimal 6 huruf`
            }),
        })
        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        try {
            await prisma.guru_users.create({
                data: {
                    nama: nama,
                    username: username,
                    password: hash,
                    status_user: Number(1),
                    user_agent: "Dummy User Agent",
                }
            }).then(() => {
                const successRes = StatusCode.CREATED
                return successResponseOnlyMessage(res, "Sukses Registrasi", successRes)
            })

        } catch (e) {
            const failedRes = StatusCode.INTERNAL_SERVER_ERROR
            return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
    }

    public async buatPelajaran(req: Request, res: Response) {
        const { nama, guruId, kelasId, jadwal, jam, createdAt } = req.body;
        const schema = Joi.object().keys({
            nama: Joi.string().required().messages({
                "any.required": `Nama tidak boleh kosong`,
            }),
            guruId: Joi.number().required().messages({
                "any.required": "Guru ID tidak boleh kosong"
            }),
            kelasId: Joi.number().required().messages({
                "any.required": "Kelas ID tidak boleh kosong"
            }),
            jadwal: Joi.number().required().messages({
                "any.required": "Jadwal ID tidak boleh kosong"
            }),
            jam: Joi.string().regex(RegExp('^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$')).required().messages({
                "any.required": "Jam tidak boleh kosong",
                "string.pattern.base": "Waktu tidak sesuai - Contoh 17:00"
            })
        }).unknown(true)
        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }
        try {
            await prisma.pelajaran.create({
                data: {
                    nama: nama,
                    guru_id: Number(guruId),
                    kelas_id: Number(kelasId),
                    jadwal: Number(jadwal),
                    jam: jam,
                    createdAt: createdAt ?? new Date()
                }
            }).then(() => {
                const successRes = StatusCode.CREATED
                return successResponseOnlyMessage(res, "Successfully Create Pelajaran", successRes)
            })
        } catch (e) {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
        }
    }

    public async buatKelas(req: Request, res: Response) {
        const { jumlah_orang, guru_id, nomor_kelas } = req.body;

        const schema = Joi.object().keys({
            jumlah_orang: Joi.number().required().messages({
                "any.required": `Jumlah Orang tidak boleh kosong`,
            }),
            guru_id: Joi.number().required().messages({
                "any.required": "Guru ID tidak boleh kosong"
            }),
            nomor_kelas: Joi.string().required().messages({
                "any.required": "Nomor Kelas tidak boleh kosong"
            }),
        }).unknown(true)

        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }
        try {
            await prisma.kelas.create({
                data: {
                    jumlah_orang: Number(jumlah_orang),
                    guru_id: Number(guru_id),
                    nomor_kelas: nomor_kelas
                }
            }).then(() => {
                const successRes = StatusCode.CREATED
                return successResponseOnlyMessage(res, "Successfully Create Kelas", successRes)
            })
        } catch (e) {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
        }
    }

    public async buatSiswa(req: Request, res: Response) {
        const { nama, username, password, kelasid } = req.body;
        const schema = Joi.object().keys({
            username: Joi.string().required().messages({
                "any.required": "Username tidak boleh kosong"
            }),
            nama: Joi.string().required().messages({
                "any.required": "Nama tidak boleh kosong"
            }),
            password: Joi.string().min(6).required().messages({
                "any.required": `Password tidak boleh kosong`,
                "string.min": `Password minimal 6 huruf`
            }),
            kelasid: Joi.number().required().messages({
                "any.required": "Kelas ID tidak boleh kosong"
            }),
        })
        // console.log("Ini kelas id", kelasid)
        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            console.log("error nih")
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        try {
            await prisma.siswa.create({
                data: {
                    nama: nama,
                    username: username,
                    password: hash,
                    status_user: Number(1),
                    user_agent: req.headers["user-agent"],
                    kelas_id: Number(kelasid)
                }
            }).then(() => {
                const successRes = StatusCode.CREATED
                return successResponseOnlyMessage(res, "Sukses Registrasi", successRes)
            }).catch((err) => {
                const failedRes = StatusCode.INTERNAL_SERVER_ERROR
                return failedResponse(res, true, `Something Went Wrong:${err}`, failedRes)
            })

        } catch (e) {
            const failedRes = StatusCode.INTERNAL_SERVER_ERROR
            return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
    }

    public async findAllSiswa(req: Request, res: Response) {
        try {
            const result = await prisma.siswa.findMany({
                select: {
                    siswa_id: true,
                    nama: true,
                    username: true,
                    status_user: true,
                    kelas: {
                        select: {
                            nomor_kelas: true
                        }
                    }
                },
            })
            const successRes = StatusCode.SUCCESS
            return successResponse(res, result, "Success Get All Siswa", successRes)
        } catch (e) {
            const failedRes = StatusCode.INTERNAL_SERVER_ERROR
            return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
    }

    public async findAllGuru(req: Request, res: Response) {
        try {
            const result = await prisma.guru_users.findMany({
                select: {
                    guru_id: true,
                    nama: true,
                    username: true,
                    status_user: true,
                    user_agent: true,

                }
            })
            const successRes = StatusCode.SUCCESS
            return successResponse(res, result, "Success Get All Guru", successRes)
        } catch (e) {
            const failedRes = StatusCode.INTERNAL_SERVER_ERROR
            return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
    }

    public async editGuru(req: Request, res: Response) {
        const { id } = req.params
        const { nama, username, password, status_user } = req.body;
        const schema = Joi.object().keys({
            username: Joi.string().required().messages({
                "any.required": "Username tidak boleh kosong"
            }),
            nama: Joi.string().required().messages({
                "any.required": "Nama tidak boleh kosong"
            }),
            status_user: Joi.number().required().messages({
                "any.required": "Status User tidak boleh kosong"
            }),
        })
        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }
        // const saltRounds = 10;
        // const salt = bcrypt.genSaltSync(saltRounds);
        // const hash = bcrypt.hashSync(password, salt);

        try {
            await prisma.guru_users.update({
                where: {
                    guru_id: Number(id)
                },
                data: {
                    nama: nama,
                    username: username,
                    status_user: Number(status_user)
                }
            }).then(() => {
                const successRes = StatusCode.SUCCESS
                return successResponseOnlyMessage(res, "Sukses Update", successRes)
            }).catch((err) => {
                const failedRes = StatusCode.INTERNAL_SERVER_ERROR
                return failedResponse(res, true, `Something Went Wrong:${err}`, failedRes)
            })

        } catch (e) {
            const failedRes = StatusCode.INTERNAL_SERVER_ERROR
            return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
    }

    public async editSiswa(req: Request, res: Response) {
        const { id } = req.params
        const { nama, username, password, status_user, kelas_id } = req.body;
        const schema = Joi.object().keys({
            username: Joi.string().required().messages({
                "any.required": "Username tidak boleh kosong"
            }),
            nama: Joi.string().required().messages({
                "any.required": "Nama tidak boleh kosong"
            }),
            status_user: Joi.number().required().messages({
                "any.required": "Status User tidak boleh kosong"
            }),
            kelas_id: Joi.number().required().messages({
                "any.required": "Kelas ID tidak boleh kosong"
            }),
        })
        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        try {
            await prisma.siswa.update({
                where: {
                    siswa_id: Number(id)
                },
                data: {
                    nama: nama,
                    username: username,
                    status_user: Number(status_user),
                    kelas_id: Number(kelas_id)
                }
            }).then(() => {
                const successRes = StatusCode.SUCCESS
                return successResponseOnlyMessage(res, "Sukses Update", successRes)
            }).catch((err) => {
                const failedRes = StatusCode.INTERNAL_SERVER_ERROR
                return failedResponse(res, true, `Something Went Wrong:${err}`, failedRes)
            })

        } catch (e) {
            const failedRes = StatusCode.INTERNAL_SERVER_ERROR
            return failedResponse(res, true, `Something Went Wrong:${e}`, failedRes)
        }
    }

    public async editKelas(req: Request, res: Response) {
        const { id } = req.params
        const { jumlah_orang, guru_id, nomor_kelas } = req.body;

        const schema = Joi.object().keys({
            jumlah_orang: Joi.number().required().messages({
                "any.required": `Jumlah Orang tidak boleh kosong`,
            }),
            guru_id: Joi.number().required().messages({
                "any.required": "Guru ID tidak boleh kosong"
            }),
            nomor_kelas: Joi.string().required().messages({
                "any.required": "Nomor Kelas tidak boleh kosong"
            }),
        }).unknown(true)

        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }
        try {
            await prisma.kelas.update({
                where: {
                    kelas_id: Number(id)
                },
                data: {
                    jumlah_orang: Number(jumlah_orang),
                    guru_id: Number(guru_id),
                    nomor_kelas: nomor_kelas
                }
            }).then(() => {
                const successRes = StatusCode.SUCCESS
                return successResponseOnlyMessage(res, "Successfully Update Kelas", successRes)
            })
        } catch (e) {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
        }
    }

    public async deleteGuru(req: Request, res: Response) {
        const { id } = req.params
        try {
            await prisma.guru_users.delete({
                where: {
                    guru_id: Number(id)
                }
            }).then(() => {
                const successRes = StatusCode.SUCCESS
                return successResponseOnlyMessage(res, "Successfully Delete Guru", successRes)
            })
        } catch (e) {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
        }
    }

    public async deleteSiswa(req: Request, res: Response) {
        const { id } = req.params
        try {
            await prisma.siswa.delete({
                where: {
                    siswa_id: Number(id)
                }
            }).then(() => {
                const successRes = StatusCode.SUCCESS
                return successResponseOnlyMessage(res, "Successfully Delete Siswa", successRes)
            })
        } catch (e) {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
        }
    }

    public async deleteKelas(req: Request, res: Response) {
        const { id } = req.params
        try {
            await prisma.kelas.delete({
                where: {
                    kelas_id: Number(id)
                }
            }).then(() => {
                const successRes = StatusCode.SUCCESS
                return successResponseOnlyMessage(res, "Successfully Delete Kelas", successRes)
            })
        } catch (e) {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong:${e}`, errorStatus)
        }
    }

}