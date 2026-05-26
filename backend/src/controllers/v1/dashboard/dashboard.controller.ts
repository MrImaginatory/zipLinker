import ShortLinks from "../../../models/links/link.model.js";
import ClickLog from "../../../models/links/clickLog.model.js";
import { Request, Response } from "express";
import { Op } from "@sequelize/core";
import sendResponse from "../../../utils/responseHandler.util.js"
import logger from "../../../utils/logger.util.js";

const dashboardAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            sendResponse(res, 401, "Unauthorized");
            return;
        }

        const shortLinks = await ShortLinks.findAll({ where: { userId } });

        if (!shortLinks) {
            sendResponse(res, 404, "No ShortLinks Found");
            return;
        }

        const totalLinks = shortLinks.length;
        const totalClicks = shortLinks.reduce((acc: number, link: any) => acc + (link.clicks || 0), 0);
        const avgClickRate = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : "0.0";

        // Calculate dynamic trends for MoM (Month over Month)
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        // Fetch counts for current month links
        const currentMonthLinksCount = await ShortLinks.count({
            where: {
                userId,
                createdAt: {
                    [Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
                }
            }
        });

        // Fetch counts for last month links
        const lastMonthLinksCount = await ShortLinks.count({
            where: {
                userId,
                createdAt: {
                    [Op.between]: [startOfLastMonth, endOfLastMonth]
                }
            }
        });

        // Calculate MoM Link Trend
        const linkChange = lastMonthLinksCount > 0 
            ? ((currentMonthLinksCount - lastMonthLinksCount) / lastMonthLinksCount) * 100 
            : (currentMonthLinksCount > 0 ? 100 : 0);
        const linkTrend = linkChange >= 0 ? `+${linkChange.toFixed(1)}% this month` : `${linkChange.toFixed(1)}% this month`;

        // Fetch counts for click logs
        const urlIds = shortLinks.map((link: any) => link.urlId);
        
        let currentMonthClicksCount = 0;
        let lastMonthClicksCount = 0;

        if (urlIds.length > 0) {
            currentMonthClicksCount = await ClickLog.count({
                where: {
                    urlId: {
                        [Op.in]: urlIds
                    },
                    createdAt: {
                        [Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
                    }
                }
            });

            lastMonthClicksCount = await ClickLog.count({
                where: {
                    urlId: {
                        [Op.in]: urlIds
                    },
                    createdAt: {
                        [Op.between]: [startOfLastMonth, endOfLastMonth]
                    }
                }
            });
        }

        // Calculate MoM Clicks Trend
        const clickChange = lastMonthClicksCount > 0 
            ? ((currentMonthClicksCount - lastMonthClicksCount) / lastMonthClicksCount) * 100 
            : (currentMonthClicksCount > 0 ? 100 : 0);
        const clickTrend = clickChange >= 0 ? `+${clickChange.toFixed(1)}% this month` : `${clickChange.toFixed(1)}% this month`;

        // Calculate Average Click Rate for both months
        const currentMonthRate = currentMonthLinksCount > 0 ? currentMonthClicksCount / currentMonthLinksCount : 0;
        const lastMonthRate = lastMonthLinksCount > 0 ? lastMonthClicksCount / lastMonthLinksCount : 0;

        // Calculate MoM Avg Click Rate Trend
        const rateChange = lastMonthRate > 0 
            ? ((currentMonthRate - lastMonthRate) / lastMonthRate) * 100 
            : (currentMonthRate > 0 ? 100 : 0);
        const rateTrend = rateChange >= 0 ? `+${rateChange.toFixed(1)}% vs last month` : `${rateChange.toFixed(1)}% vs last month`;

        const analytics = {
            totalLinks,
            totalClicks,
            activeLinks: shortLinks.filter((link: any) => link.isActive).length,
            inactiveLinks: shortLinks.filter((link: any) => !link.isActive).length,
            avgClickRate: parseFloat(avgClickRate),
            linkTrend,
            clickTrend,
            rateTrend
        }

        sendResponse(res, 200, "Dashboard Analytics", analytics);
        return;
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in dashboardAnalytics : ${error}`);
        sendResponse(res, 500, "Internal Server Error");
        return;
    }
}

export {
    dashboardAnalytics
}