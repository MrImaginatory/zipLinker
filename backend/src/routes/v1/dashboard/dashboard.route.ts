import { Router } from "express";
import { isAuthenticated } from "../../../middlewares/v1/auth.middleware.js";
import { dashboardAnalytics, recentActivity } from "../../../controllers/v1/dashboard/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/insights", isAuthenticated, dashboardAnalytics);
dashboardRouter.get("/activity", isAuthenticated, recentActivity);

export default dashboardRouter;
