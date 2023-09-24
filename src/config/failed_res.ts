import { Response } from "express"

export const failedResponse = (res: Response, error: boolean, message: string, status: number) => {
    return res.status(status).json({
        status,
        error,
        message,
    })
}