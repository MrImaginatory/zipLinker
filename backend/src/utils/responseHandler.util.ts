import type { Response } from "express";

export const sendResponse = (
    res: Response,
    statusCode: number,
    message: string,
    data: any = null
) => {
    const success = statusCode >= 200 && statusCode < 300;

    const response: any = {
        success,
        message,
    };

    // Only include data if it's not null, undefined, or an empty object
    if (data !== null && data !== undefined) {
        if (typeof data === 'object' && Object.keys(data).filter(key => data[key] !== undefined).length > 0) {
            response.data = data;
        } else if (typeof data !== 'object' || Array.isArray(data)) {
            response.data = data;
        }
    }

    return res.status(statusCode).json(response);
};

export default sendResponse;