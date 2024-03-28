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

export interface ResponseModelWithPageTotalResultAndLimit {
    status: number;
    error: false;
    data: any;
    total_page: number;
    total_result: number;
    limit: number;
    message: string;
}

export const successResponseOnlyMessageToken = (res: Response, user_id: number, token: string, message: string, status: number) => {
    return res.status(status).json({
        status,
        user_id,
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



