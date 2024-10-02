import { Router } from "express";
import { UserController } from "./user.controller";
import authHandler from "../../middleware/auth";
import { User_Role } from "./user.constant";

const router = Router();

router.get(
  '/get-me',
  authHandler(User_Role.user, User_Role.admin),
  UserController.getMe
)

router.get(
  '/:userId',
  UserController.getUser
)

router.get(
  '/',
  UserController.getAllUsers
)



router.put(
  '/update-profile',
  UserController.updateUser
)

router.delete(
  '/:userId',
  UserController.deleteUser
)

router.put(
  '/:userId/follow-toggle',
  authHandler(User_Role.user, User_Role.admin),
  UserController.toggleFollow
);


export const UserRoutes = router;