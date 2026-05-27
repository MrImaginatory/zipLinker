import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/responseHandler.util.js";
import { verifyToken } from "../../utils/jwt.util.js";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        sendResponse(res, 401, "Unauthorized: Please login to perform this action");
        return;
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
        sendResponse(res, 401, "Unauthorized: Invalid token");
        return;
    }

    if ('error' in decodedToken) {
        if (decodedToken.error === 'expired') {
            sendResponse(res, 401, "Session timed out please login again");
            return;
        }
        sendResponse(res, 401, "Unauthorized: Invalid token");
        return;
    }

    req.userId = decodedToken.userId;

    next();
};
