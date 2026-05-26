import { Router } from "express";
import { isAuthenticated } from "../../../middlewares/v1/auth.middleware.js";
import { dashboardAnalytics } from "../../../controllers/v1/dashboard/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/insights", isAuthenticated, dashboardAnalytics);

export default dashboardRouter;
