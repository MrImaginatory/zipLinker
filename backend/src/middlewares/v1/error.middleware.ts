import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger.util.js";
import sendResponse from "../../utils/responseHandler.util.js";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(`[Global Error] ${err.stack || err.message || err}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    sendResponse(res, statusCode, message, null);
};
