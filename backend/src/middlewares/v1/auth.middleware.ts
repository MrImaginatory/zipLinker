import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/responseHandler.util.js";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.userId) {
        sendResponse(res, 401, "Unauthorized: Please login to perform this action");
        return;
    }
    
    // User is authenticated, proceed to the next middleware or controller
    next();
};
