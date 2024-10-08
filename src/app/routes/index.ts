import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.routes";
import { UserRoutes } from "../module/user/user.routes";
import { PostRoutes } from "../module/post/post.routes";
import { PaymentRoutes } from "../module/payment/payment.routes";
import { AnalyticsRoutes } from "../module/analytics/analytics.routes";

const router = Router();

const routers = [
  { path: '/auth', routes: AuthRoutes },
  { path: '/users', routes: UserRoutes },
  { path: '/posts', routes: PostRoutes },
  { path: '/payment', routes: PaymentRoutes },
  { path: '/analytics', routes: AnalyticsRoutes },
]

routers.forEach(route => router.use(route.path, route.routes))


export default router;