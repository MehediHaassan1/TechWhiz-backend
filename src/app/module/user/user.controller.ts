import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserService.getUserFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully!",
    data: result
  });
})


const getAllUsers = catchAsync(async(req, res) => {
  const result = await UserService.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully!",
    data: result
  });
})


const updateUser = catchAsync(async(req, res) =>{
  // const email = req.user.email;
  const email = 'johndoe@example.com'
  const data = req.body;
  const result = await UserService.updateUserInDB(email, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully!",
    data: result
  });
})


const deleteUser = catchAsync(async(req, res) =>{
  const userId = req.params.userId;
  const result = await UserService.deleteUserFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully!",
    data: result
  });
})

export const UserController = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
}