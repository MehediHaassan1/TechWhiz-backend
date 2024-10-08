import { readFileSync } from 'fs';
import path, { join } from 'path';
import httpStatus from "http-status";
import User from "../user/user.model";
import AppError from "../../errors/AppError";
import { generateUniqueId, initiatePayment, verifyPayment } from "./payment.utils";
import Payment from './payment.model';
import { IPayment } from './payment.interface';

const getPaymentHistoryFromDB = async () => {
  const result = await Payment.find().populate('user');
  return result;
}

const getMyPaymentHistoryFromDB = async (email: string) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `User ${email} does not exist!`);
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, `User not found!`);
  }
  if (user?.status === 'block') {
    throw new AppError(httpStatus.BAD_REQUEST, `User is blocked!`);
  }

  const result = await Payment.find({ user: user?._id });
  return result;

}

const createPaymentIntoDB = async (email: string, data: Partial<IPayment>) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `User ${email} does not exist!`);
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, `User not found!`);
  }
  if (user?.status === 'block') {
    throw new AppError(httpStatus.BAD_REQUEST, `User is blocked!`);
  }

  if (user) {
    const trxID = await generateUniqueId();

    const paymentData = {
      user: user?._id,
      trxID,
      name: user?.name,
      email: user?.email,
      address: user?.address || 'USA',
      phone: user?.phone,
      ...data,
    }
    const result = await initiatePayment(paymentData);
    return result;
  }
}

const confirmPaymentIntoDB = async (
  trxId?: string | undefined,
  payload?: string | undefined,
  paymentData?: string | undefined
) => {


  let message = "";
  let parsedPaymentData;

  try {

    const res = await verifyPayment(trxId);


    if (res) {

      try {
        parsedPaymentData = typeof paymentData === "string"
          ? JSON.parse(paymentData)
          : paymentData;
      } catch (error) {
        throw new Error("Invalid JSON format in payment data");
      }

      if (
        !parsedPaymentData!.user ||
        !parsedPaymentData!.packageName ||
        !parsedPaymentData!.packagePrice ||
        !parsedPaymentData!.trxID
      ) {
        throw new Error("Missing required payment data fields.");
      }
    }



    const startDate = new Date();
    let endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30)

    const paymentInfo = {
      user: parsedPaymentData?.user,
      trxID: trxId,
      packageName: parsedPaymentData?.packageName,
      packagePrice: parsedPaymentData?.packagePrice,
      status: res.pay_status === "Successful" ? "completed" : "failed",
      startDate,
      endDate,
    }



    if (res?.pay_status === 'Successful') {

      console.log({ status: res?.pay_status })

      console.log(parsedPaymentData);

      const result2 = await User.findByIdAndUpdate(
        {
          _id: parsedPaymentData?.user,
        },
        {
          isVerified: true,
          subscription: parsedPaymentData?.packageName
        },
        { new: true }
      )
      console.log(result2)

      const result1 = await Payment.create(paymentInfo)
      console.log(result1)




      message = "Payment successful";
      console.log(message);
      const filePath = join(__dirname, "../../../../public/success.html");
      let template = readFileSync(filePath, "utf-8");
      template = template.replace("{{message}}", message);
      return template;

    } else {

      throw new Error("Payment validation failed.");

    }
  } catch (error) {


    message = "Payment failed";

    const filePath = join(__dirname, "../../../../public/fail.html");
    let template;
    try {
      template = readFileSync(filePath, "utf-8");
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal server error!",
      );
    }
    template = template.replace("{{message}}", message);
    return template;
  }
}

export const PaymentService = {
  getPaymentHistoryFromDB,
  getMyPaymentHistoryFromDB,
  createPaymentIntoDB,
  confirmPaymentIntoDB,
}