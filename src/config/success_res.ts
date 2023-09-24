import { Response } from "express"

export const successResponse = (res: Response, data: any, message: string, status: number) => {
    return res.status(status).json({
        status,
        data,
        message,
    })
}

export const successResponseWithToken = (res: Response, data: any, token: string, message: string, status: number) => {
    return res.status(status).json({
        status,
        data,
        token,
        message,
    })
}

export const successResponseOnlyMessageToken = (res: Response, token: string, message: string, status: number) => {
    return res.status(status).json({
        status,
        token,
        message,
    })
}

export const successResponseOnlyMessageTokenRole = (res: Response, token: string, role: number, message: string, status: number) => {
    return res.status(status).json({
        status,
        token,
        role,
        message,
    })
}


export const successResponseOnlyMessage = (res: Response, message: string, status: number) => {
    return res.status(status).json({
        status,
        message,
    })
}



