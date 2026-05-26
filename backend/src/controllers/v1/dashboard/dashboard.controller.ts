import ShortLinks from "../../../models/links/link.model.js";
import { Request, Response } from "express";
import sendResponse from "../../../utils/responseHandler.util.js"
import logger from "../../../utils/logger.util.js";

const dashboardAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;

        const shortLinks = await ShortLinks.findAll({ where: { userId } });

        if (!shortLinks) {
            return sendResponse(res, 404, "No ShortLinks Found");
        }

        const analytics = {
            totalLinks: shortLinks.length,
            totalClicks: shortLinks.reduce((acc: number, link: any) => acc + link.clickCount, 0),
            activeLinks: shortLinks.filter((link: any) => link.isActive).length,
            inactiveLinks: shortLinks.filter((link: any) => !link.isActive).length,
        }

        return sendResponse(res, 200, "Dashboard Analytics", analytics);
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in getProfileDetails : ${error}`);
        return sendResponse(res, 500, "Internal Server Error");
    }
}

export {
    dashboardAnalytics
}