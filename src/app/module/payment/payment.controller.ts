import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const getPaymentHistory = catchAsync(async (req, res) => {
  const result = await PaymentService.getPaymentHistoryFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment fetched successfully!",
    data: result,
  })
})

const getMyPaymentHistory = catchAsync(async (req, res) => {
  const email = req.user.email;
  const result = await PaymentService.getMyPaymentHistoryFromDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment fetched successfully!",
    data: result,
  })
})

const createPayment = catchAsync(async (req, res) => {
  const email = req.user.email;
  const result = await PaymentService.createPaymentIntoDB(email, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment successfully done!",
    data: result,
  })

})

const confirmPayment = catchAsync(async (req, res) => {
  const { trxId, status, paymentData } = req.query;
  const result = await PaymentService.confirmPaymentIntoDB(
    trxId as string,
    status as string,
    paymentData as string
  );

  res.send(result);
});


export const PaymentController = {
  getPaymentHistory,
  getMyPaymentHistory,
  createPayment,
  confirmPayment,
}