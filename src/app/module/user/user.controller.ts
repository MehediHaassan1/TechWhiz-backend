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


const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully!",
    data: result
  });
})

const getMe = catchAsync(async (req, res) => {
  const email = req.user.email;
  const result = await UserService.getMeFromDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile data fetched successfully!",
    data: result
  });
})


const updateUser = catchAsync(async (req, res) => {
  const email = req.user.email;
  const data = req.body;
  const result = await UserService.updateUserInDB(email, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully!",
    data: result
  });
})

const manageUserStatus = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const action: 'block' | 'unblock' = req.query.action as 'block' | 'unblock';
  const result = await UserService.manageUserStatusIntoDB(userId, action);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status updated successfully!",
    data: result
  });
})

const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserService.deleteUserFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully!",
    data: result
  });
})

const toggleFollow = catchAsync(async (req, res) => {
  const followingId = req.params.userId;
  const followerEmail = req.user.email;
  const result = await UserService.toggleFollowIntoDB(followingId, followerEmail);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Action successful!",
    data: result
  });
})

export const UserController = {
  getAllUsers,
  getUser,
  getMe,
  updateUser,
  manageUserStatus,
  deleteUser,
  toggleFollow,
}