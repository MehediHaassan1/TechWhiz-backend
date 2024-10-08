import { Router } from "express";
import authHandler from "../../middleware/auth";
import { User_Role } from "../user/user.constant";
import { PaymentController } from "./payment.controller";

const router = Router();

router.get(
  '/',
  authHandler(User_Role.admin),
  PaymentController.getPaymentHistory
)

router.get(
  '/my-payment-history',
  authHandler(User_Role.admin, User_Role.user),
  PaymentController.getMyPaymentHistory
)

router.post(
  '/create-payment',
  authHandler(User_Role.admin, User_Role.user),
  PaymentController.createPayment
)

router.post(
  "/confirmation",
  PaymentController.confirmPayment, 
);


export const PaymentRoutes = router;;