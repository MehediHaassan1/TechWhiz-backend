import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.routes";

const router = Router();

const routers = [
  { path: '/auth', routes: AuthRoutes },
]

routers.forEach(route => router.use(route.path, route.routes))


export default router;