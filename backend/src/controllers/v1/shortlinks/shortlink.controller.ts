import ShortLinks from "../../../models/links/link.model.js";
import { Request, Response } from "express";
import sendResponse from "../../../utils/responseHandler.util.js"
import logger from "../../../utils/logger.util.js";
import { generateNanoId } from "../../../utils/shortLink.util.js"
import config from "../../../config/config.js";

const createShortLink = async (req: Request, res: Response) => {
    const { longUrl, isActive } = req.body

    try {
        const userId = req.session.userId!;

        const longUrlExists = await ShortLinks.findOne({
            where: {
                longUrl,
                userId
            }
        })

        let isActiveValue;

        if (isActive === undefined || isActive === null) {
            isActiveValue = true;
        } else {
            isActiveValue = isActive;
        }

        if (longUrlExists) {
            sendResponse(res, 400, "Url already exists");
            return
        }

        const createShortUrl = await ShortLinks.create({
            longUrl,
            isActive: isActiveValue,
            shortCode: generateNanoId(),
            userId
        })

        const shortUrl = config.BASE_URL + "/" + createShortUrl.shortCode;
        const longUrlLink = createShortUrl.longUrl;

        const respData = {
            longUrlLink,
            shortUrl,
            isActive: isActiveValue
        }

        sendResponse(res, 201, "Url Created Successfully", respData);
        return;

    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in createShortLink : ${error}`);
        sendResponse(res, 500, "Internal Server Error");
        return;
    }
}

const updateLinks = async (req: Request, res: Response) => {
    try {
        const { urlId } = req.params;
        const { longUrl, isActive } = req.body;

        const urlExists = await ShortLinks.findByPk(urlId)

        if (!urlExists) {
            sendResponse(res, 404, "Url Not Found");
            return
        }

        if (urlExists.userId !== req.session.userId) {
            sendResponse(res, 403, "You are not authorized to update this url");
            return
        }

        const updateUrl = await ShortLinks.update({
            longUrl,
            isActive
        }, {
            where: {
                urlId
            }
        })

        sendResponse(res, 200, "Url Updated Successfully", updateUrl);
        return;
    }
    catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in updateLinks : ${error}`);
        sendResponse(res, 500, "Internal Server Error");
        return;
    }

}

const getShortLinks = async (req: Request, res: Response) => {
    try {

        const userId = req.session.userId!;

        const shortLinks = await ShortLinks.findAll({
            where: {
                userId
            },
            attributes: ["urlId", "longUrl", "isActive", "shortCode", "clicks"]
        });

        if (!shortLinks) {
            sendResponse(res, 404, "No Short Links Found");
            return
        }

        const respData = shortLinks.map((shortLink: ShortLinks) => {
            const shortUrl = config.BASE_URL + "/" + shortLink.shortCode;

            return {
                urlId: shortLink.urlId,
                longUrlLink: shortLink.longUrl,
                shortUrl: shortUrl,
                noOfClicks: shortLink.clicks,
                isActive: shortLink.isActive
            }
        })

        sendResponse(res, 200, "Short Links Fetched Successfully", respData);
        return;
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in getShortLinks : ${error}`);
        sendResponse(res, 500, "Internal Server Error");
        return;
    }
}

const getLinkDetails = async (req: Request, res: Response) => {
    try {
        const { urlId } = req.params;

        // Check if urlId is a valid UUID format to prevent Sequelize from throwing an error
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (typeof urlId !== "string" || !uuidRegex.test(urlId)) {
            sendResponse(res, 404, "Short Link Not Found");
            return;
        }

        const shortLink = await ShortLinks.findOne({
            where: {
                urlId
            }
        });

        if (!shortLink) {
            sendResponse(res, 404, "Short Link Not Found");
            return
        }

        const shortUrl = config.BASE_URL + "/" + shortLink.shortCode;

        const respData = {
            longUrlLink: shortLink.longUrl,
            shortUrl: shortUrl,
            noOfClicks: shortLink.clicks,
            isActive: shortLink.isActive
        }

        sendResponse(res, 200, "Short Link Details Fetched Successfully", respData);
        return;
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in getLinkDetails : ${error}`);
        sendResponse(res, 500, "Internal Server Error");
        return;
    }
}

const getShortLinkCount = async (req: Request, res: Response) => {
    try {
        const urlId = req.params.urlId;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (typeof urlId !== "string" || !uuidRegex.test(urlId)) {
            sendResponse(res, 404, "Short Link Not Found");
            return;
        }

        const shortLink = await ShortLinks.findOne({
            where: {
                urlId
            },
            attributes: ["clicks", "userId"]
        })

        if (!shortLink) {
            sendResponse(res, 404, "Short Link Not Found");
            return;
        }

        if (shortLink.userId !== req.session.userId) {
            sendResponse(res, 403, "You are not authorized to view this short link");
            return;
        }

        sendResponse(res, 200, "Short Link Count Fetched Successfully", shortLink.clicks);
        return;
    }
    catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in getShortLinkCount : ${error}`);
        sendResponse(res, 500, "Internal Server Error");
        return;
    }
}

const getRedirectLink = async (req: Request, res: Response) => {
    const { shortCode } = req.params;

    try {
        const shortLink = await ShortLinks.findOne({
            where: {
                shortCode
            }
        })

        if (!shortLink) {
            sendResponse(res, 404, "Short Link Not Found");
            return
        }

        if (!shortLink.isActive) {
            sendResponse(res, 400, "Short Link Is Not Active");
            return
        }

        shortLink.clicks++;
        await shortLink.save();

        res.redirect(shortLink.longUrl);
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in getRedirectLink : ${error}`);
        sendResponse(res, 500, "Internal Server Error");
        return;

    }
}

export { createShortLink, updateLinks, getShortLinks, getLinkDetails, getRedirectLink, getShortLinkCount }