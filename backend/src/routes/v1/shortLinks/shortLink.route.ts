import { Router } from "express";
import { createShortLink, updateLinks, getShortLinks, getLinkDetails, getShortLinkCount } from "../../../controllers/v1/shortlinks/shortlink.controller.js"
import validate from "../../../middlewares/v1/validate.middleware.js";
import { createShortLinkValidator, updateShortLinkValidator } from "../../../validations/shortlink/shortlink.validator.js"

import { isAuthenticated } from "../../../middlewares/v1/auth.middleware.js";

const shortLinkRouter = Router();

// Secure routes that require login
shortLinkRouter.post("/create", isAuthenticated, validate(createShortLinkValidator), createShortLink);
shortLinkRouter.get("/all", isAuthenticated, getShortLinks);
shortLinkRouter.get("/count/:urlId", isAuthenticated, getShortLinkCount);
shortLinkRouter.get("/details/:urlId", isAuthenticated, getLinkDetails);
shortLinkRouter.put("/update/:urlId", isAuthenticated, validate(updateShortLinkValidator), updateLinks);

export default shortLinkRouter;