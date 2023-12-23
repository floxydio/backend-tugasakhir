import { Request, Response } from "express"
import { successResponse, successResponseOnlyMessage, successResponseOnlyMessageToken, successResponseWithToken } from '../config/success_res';
import { failedResponse } from '../config/failed_res';
import StatusCode from '../config/status_code';
import { prisma } from "../config/database"


export class RoleController {
    public async getRole(req: Request, res: Response) {
        const role = req.params.role
        await prisma.role_user.findMany({
            where: {
                role_id: Number(role)
            }
        }).then((data) => {
            const successStatus = StatusCode.SUCCESS
            return successResponse(res, data, "Successfully Find Role", successStatus)
        }).catch((err) => {
            const errorStatus = StatusCode.BAD_REQUEST
            return failedResponse(res, true, `Something Went Wrong:${err}`, errorStatus)
        })

    }
}