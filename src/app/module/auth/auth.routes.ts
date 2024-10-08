import { Router } from "express";
import validateRequestHandler from "../../middleware/validationRequest";
import { UserValidation } from "../user/user.validation";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import { User_Role } from "../user/user.constant";
import authHandler from "../../middleware/auth";

const router = Router();


router.post(
  '/register',
  (req,res, next) => {
    console.log(req.body, 'route')
    next()
  },
  validateRequestHandler(UserValidation.createUserValidation),
  AuthController.registerUser
)


router.post(
  '/login',
  validateRequestHandler(AuthValidation.loginValidation),
  AuthController.loginUser
)


router.post(
  '/change-password',
  authHandler(User_Role.user, User_Role.admin),
  validateRequestHandler(AuthValidation.changePasswordValidation),
  AuthController.changePassword
);

router.post(
  '/refresh-token',
  validateRequestHandler(AuthValidation.refreshTokenValidation),
  AuthController.refreshToken
);

export const AuthRoutes = router;