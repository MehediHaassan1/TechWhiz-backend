import { Router } from "express";
import validateRequestHandler from "../../middleware/validationRequest";
import { UserValidation } from "../user/user.validation";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();


router.post(
  '/register',
  validateRequestHandler(UserValidation.createUserValidation),
  AuthController.registerUser
)


router.post(
  '/login',
  validateRequestHandler(AuthValidation.loginValidation),
  AuthController.loginUser
)

export const AuthRoutes = router;