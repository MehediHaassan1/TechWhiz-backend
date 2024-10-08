import { Router } from "express";
import authHandler from "../../middleware/auth";
import { User_Role } from "../user/user.constant";
import { AnalyticsController } from "./analytics.controller";

const router = Router();

router.get(
  '/',
  // authHandler(User_Role.admin),
  AnalyticsController.getAnalytics
)

export const AnalyticsRoutes = router;