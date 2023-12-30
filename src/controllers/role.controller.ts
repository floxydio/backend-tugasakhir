import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse, failedResponseValidation } from '../config/failed_res';
import StatusCode from '../config/status_code';
import { prisma } from "../config/database"
import dotenv from 'dotenv'
import Joi from 'joi'
dotenv.config()

export class RoleController {
    /**
* GET /v2/role
* @summary Find Page by Role
* @tags Role
* @param {number} role.path.required - role by number
* @return {object} 200 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
    public async getRole(req: Request, res: Response) {
        await prisma.role_user.findMany({
        }).then((data) => {
            const successStatus = StatusCode.SUCCESS
            return successResponse(res, data, "Successfully Find Role", successStatus)
        }).catch((err) => {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong:${err}`, errorStatus)
        })
    }

    /**
* POST /v2/create-role
* @summary Create Role
* @tags Role
* @param {number} role_id.form.required - form data - application/x-www-form-urlencoded
* @param {string} menu_name.form.required - form data - application/x-www-form-urlencoded
* @param {number} status_menu.form.required - form data - application/x-www-form-urlencoded
* @param {string} url_path.form.required - form data - application/x-www-form-urlencoded
* @param {string} token_access.form.required - form data - application/x-www-form-urlencoded
* @return {object} 201 - success response - application/json
* @return {object} 400 - bad request response
* @return {object} 401 - token expired / not found
*/
    public async createRole(req: Request, res: Response) {
        const { role_id, menu_name, status_menu, url_path, token_access } = req.body

        const schema = Joi.object().keys({
            role_id: Joi.number().required().messages({
                "any.required": `Role Number tidak boleh kosong`,

            }),
            menu_name: Joi.string().required().messages({
                "any.required": "Nama Menu tidak boleh kosong"
            }),
            status_menu: Joi.number().required().messages({
                "any.required": "Status Menu tidak boleh kosong"
            }),
            url_path: Joi.string().required().messages({
                "any.required": "Url Path tidak boleh kosong"
            }),
            token_access: Joi.string().required().messages({
                "any.required": "Token access dibutuhkan untuk input"
            }),

        })
        const { error, value } = schema.validate(req.body)
        if (error !== undefined) {
            return failedResponseValidation(res, true, error?.details.map((e) => e.message).join(","), 400)
        }
        if (token_access !== process.env.TOKEN_CREATED) {
            return failedResponseValidation(res, true, "Token tidak sesuai", 400)
        }

        await prisma.role_user.create({
            data: {
                menu_name: menu_name,
                role_id: Number(role_id),
                url_path: url_path,
                status_menu: Number(status_menu),
            }
        }).then(() => {
            return successResponseOnlyMessage(res, "Successfully Created", 201)
        }).catch((err) => {
            return failedResponse(res, true, `Something Went Wrong ${err}`, 400)

        })

    }
}