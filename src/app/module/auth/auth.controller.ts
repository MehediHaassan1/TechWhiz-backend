import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

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


const loginUser = catchAsync(async(req, res) =>{

  const data = req.body;
  const result = await AuthService.loginUserIntoDB(data)

sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User loggedin successfully!",
    data: result
  });
})

export const AuthController = {
  registerUser,
  loginUser,
}