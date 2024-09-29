import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.routes";
import { UserRoutes } from "../module/user/user.routes";
import { PostRoutes } from "../module/post/post.routes";

const router = Router();

const routers = [
  { path: '/auth', routes: AuthRoutes },
  { path: '/users', routes: UserRoutes },
  { path: '/posts', routes: PostRoutes },
]

routers.forEach(route => router.use(route.path, route.routes))


export default router;