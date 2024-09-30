import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import User from "./user.model"
import { IUser } from "./user.interface";

const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
}

const getUserFromDB = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
  }

  return user;
}

const getMeFromDB = async (email: string) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
  }

  return user;
}


const updateUserInDB = async (email: string, payload: Partial<IUser>) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!')
  }

  const isUserNameUserExists = await User.findOne({ userName: payload.userName })
  if (isUserNameUserExists) {
    throw new AppError(httpStatus.CONFLICT, 'Username is already taken!')
  }

  const result = await User.findByIdAndUpdate(
    user?._id,
    payload,
    { new: true }
  )

  return result;
}





const deleteUserFromDB = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
  }

  const result = User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  )

  return result;
}


export const UserService = {
  getUserFromDB,
  getAllUsersFromDB,
  getMeFromDB,
  updateUserInDB,
  deleteUserFromDB,
}