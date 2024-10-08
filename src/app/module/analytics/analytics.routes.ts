import { Router } from "express";
import authHandler from "../../middleware/auth";
import { User_Role } from "../user/user.constant";
import { AnalyticsController } from "./analytics.controller";

const router = Router();

router.get(
  '/',
  authHandler(User_Role.admin),
  AnalyticsController.getAnalytics
)

router.get(
  '/user-analytics',
  authHandler(User_Role.user),
  AnalyticsController.getUserAnalytics
)

export const AnalyticsRoutes = router;