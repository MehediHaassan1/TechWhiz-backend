import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.get(
  '/:userId', 
  UserController.getUser
)

router.get(
  '/',
  UserController.getAllUsers
)

router.post(
  '/update-profile',
  UserController.updateUser
)

router.delete(
  '/:userId',
  UserController.deleteUser
)


export const UserRoutes = router;