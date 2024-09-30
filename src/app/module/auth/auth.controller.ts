import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import config from "../../config";

const registerUser = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await AuthService.registerUserIntoDB(data)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully!",
    data: result
  });
})


const loginUser = catchAsync(async (req, res) => {

  const data = req.body;
  const { accessToken, refreshToken, user } = await AuthService.loginUserIntoDB(data)

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged successfully!",
    data: { accessToken, refreshToken, user },
  });
})

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const result = await AuthService.changePasswordIntoDB(req.user, oldPassword, newPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully!',
    data: result,
  });
});


const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshTokenFromDB(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved successfully!',
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
}