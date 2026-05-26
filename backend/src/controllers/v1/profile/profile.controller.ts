import User from "../../../models/users/user.model.js";
import { Request, Response } from "express";
import sendResponse from "../../../utils/responseHandler.util.js"
import logger from "../../../utils/logger.util.js";

const getProfileDetails = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return sendResponse(res, 401, "Unauthorized");
        }

        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return sendResponse(res, 401, "Unauthorized");
        }

        return sendResponse(res, 200, "User Profile", user);
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in getProfileDetails : ${error}`);
        return sendResponse(res, 500, "Internal Server Error");
    }
}

export { getProfileDetails }