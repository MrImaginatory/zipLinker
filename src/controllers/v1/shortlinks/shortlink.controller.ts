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

const getShortLinks = async (req: Request, res: Response) => {
    try {

        const userId = req.session.userId!;

        const shortLinks = await ShortLinks.findAll({
            where: {
                userId
            },
            attributes: ["longUrl", "isActive", "shortCode"]
        });

        if (!shortLinks) {
            sendResponse(res, 404, "No Short Links Found");
            return
        }

        const respData = shortLinks.map((shortLink: ShortLinks) => {
            const shortUrl = config.BASE_URL + "/" + shortLink.shortCode;

            return {
                longUrlLink: shortLink.longUrl,
                shortUrl,
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

export { createShortLink, getShortLinks, getRedirectLink }