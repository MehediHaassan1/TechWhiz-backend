import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AnalyticsService } from "./analytics.service";

const getAnalytics = catchAsync(async (req, res) => {
  const result = await AnalyticsService.getAnalyticsFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics was successfully retrieved!',
    data: result,
  })
})

const getUserAnalytics = catchAsync(async (req, res) => {
  const email = req.user.email;
  const result = await AnalyticsService.getUserAnalyticsFromDB(email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics was successfully retrieved!',
    data: result,
  })
})

export const AnalyticsController = {
  getAnalytics,
  getUserAnalytics,
}