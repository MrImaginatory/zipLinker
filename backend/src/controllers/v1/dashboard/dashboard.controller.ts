import ShortLinks from "../../../models/links/link.model.js";
import ClickLog from "../../../models/links/clickLog.model.js";
import { Request, Response } from "express";
import { Op, fn, col } from "@sequelize/core";
import sendResponse from "../../../utils/responseHandler.util.js"
import logger from "../../../utils/logger.util.js";

const dashboardAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = req.userId!;

        const shortLinks = await ShortLinks.findAll({ where: { userId } });

        if (!shortLinks) {
            sendResponse(res, 404, "No ShortLinks Found");
            return;
        }

        const urlIds = shortLinks.map((link: any) => link.urlId);

        let totalClicks = 0;
        if (urlIds.length > 0) {
            totalClicks = await ClickLog.count({
                where: {
                    urlId: {
                        [Op.in]: urlIds
                    }
                }
            });
        }

        const totalLinks = shortLinks.length;
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

const recentActivity = async (req: Request, res: Response) => {
    try {
        const userId = req.userId!;

        const shortLinks = await ShortLinks.findAll({
            where: { userId }
        });

        const urlIds = shortLinks.map((link: any) => link.urlId);

        // 1. Last Added Link
        const lastAddedLinkData: any = await ShortLinks.findOne({
            where: { userId },
            order: [["createdAt", "DESC"]],
            attributes: ["urlId", "shortCode", "longUrl", "isActive", "createdAt"],
            raw: true
        });

        let lastAddedLink = null;
        if (lastAddedLinkData) {
            const clicks = await ClickLog.count({ where: { urlId: lastAddedLinkData.urlId } });
            lastAddedLink = { ...lastAddedLinkData, clicks };
        }

        // 2. 1-Day Activities Timeline (Creations & Clicks within last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const recentLinks = await ShortLinks.findAll({
            where: {
                userId,
                createdAt: {
                    [Op.gte]: oneDayAgo
                }
            },
            attributes: ["urlId", "shortCode", "longUrl", "createdAt"]
        });

        let recentClicks: any[] = [];
        if (urlIds.length > 0) {
            recentClicks = await ClickLog.findAll({
                where: {
                    urlId: {
                        [Op.in]: urlIds
                    },
                    createdAt: {
                        [Op.gte]: oneDayAgo
                    }
                },
                order: [["createdAt", "DESC"]]
            });
        }

        const linkMap = new Map(shortLinks.map((link: any) => [link.urlId, link]));
        const activities: any[] = [];

        // Map link creations
        recentLinks.forEach((link: any) => {
            activities.push({
                id: `create-${link.urlId}`,
                type: "creation",
                title: "Link Shortened",
                description: `Created shortcode /${link.shortCode}`,
                target: link.longUrl,
                timestamp: link.createdAt
            });
        });

        // Map clicks
        recentClicks.forEach((click: any) => {
            const link = linkMap.get(click.urlId);
            if (link) {
                activities.push({
                    id: `click-${click.id}`,
                    type: "click",
                    title: "Link Visited",
                    description: `Short link /${link.shortCode} was clicked`,
                    target: link.longUrl,
                    timestamp: click.createdAt
                });
            }
        });

        // Sort activities by timestamp descending
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // 3. Daily Graph Clicks (Past 7 Days)
        const clickLogs = urlIds.length > 0 ? await ClickLog.findAll({
            where: {
                urlId: { [Op.in]: urlIds }
            },
            attributes: ["createdAt"]
        }) : [];

        const dailyClicks: any[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);

            const start = new Date(d);
            const end = new Date(d);
            end.setHours(23, 59, 59, 999);

            const count = clickLogs.filter((log: any) => {
                const logDate = new Date(log.createdAt);
                return logDate >= start && logDate <= end;
            }).length;

            const dateLabel = d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }); // e.g. "Mon 25"

            dailyClicks.push({
                label: dateLabel,
                clicks: count
            });
        }

        // 4. Monthly Graph Clicks (Past 12 Months)
        const monthlyClicks: any[] = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);

            const year = d.getFullYear();
            const month = d.getMonth();

            const start = new Date(year, month, 1, 0, 0, 0, 0);
            const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

            const count = clickLogs.filter((log: any) => {
                const logDate = new Date(log.createdAt);
                return logDate >= start && logDate <= end;
            }).length;

            const monthLabel = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }); // e.g. "May 26"

            monthlyClicks.push({
                label: monthLabel,
                clicks: count
            });
        }

        // 5. Top Domains (Past Clicks Share)
        const domainClicksMap: { [key: string]: number } = {};
        
        let clickMap = new Map();
        if (urlIds.length > 0) {
            const clickCounts = await ClickLog.findAll({
                where: { urlId: { [Op.in]: urlIds } },
                attributes: ['urlId', [fn('COUNT', col('urlId')), 'count']],
                group: ['urlId'],
                raw: true
            });
            clickMap = new Map(clickCounts.map((c: any) => [c.urlId, parseInt(c.count, 10) || 0]));
        }

        shortLinks.forEach((link: any) => {
            const clicks = clickMap.get(link.urlId) || 0;
            try {
                if (link.longUrl) {
                    const domain = new URL(link.longUrl).hostname.replace("www.", "");
                    domainClicksMap[domain] = (domainClicksMap[domain] || 0) + clicks;
                }
            } catch (e) {
                const domain = "Others";
                domainClicksMap[domain] = (domainClicksMap[domain] || 0) + clicks;
            }
        });

        const domainShares = Object.keys(domainClicksMap).map(domain => ({
            domain,
            clicks: domainClicksMap[domain]
        }));

        domainShares.sort((a, b) => b.clicks - a.clicks);

        let topDomains = domainShares.slice(0, 4);
        const otherDomains = domainShares.slice(4);
        if (otherDomains.length > 0) {
            const otherClicks = otherDomains.reduce((acc, curr) => acc + curr.clicks, 0);
            topDomains.push({
                domain: "Others",
                clicks: otherClicks
            });
        } else {
            topDomains = domainShares.slice(0, 5);
        }

        const payload = {
            lastAddedLink,
            activities,
            dailyClicks,
            monthlyClicks,
            topDomains
        };

        sendResponse(res, 200, "Recent Activity & Analytics", payload);
        return;
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in recentActivity : ${error}`);
        sendResponse(res, 500, "Internal Server Error");
        return;
    }
}

export {
    dashboardAnalytics,
    recentActivity
}