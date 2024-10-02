import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import User from "./user.model"
import { IUser } from "./user.interface";
import mongoose, { ObjectId, Schema, Types } from "mongoose";

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
  const user = await User.findOne({ email: email }).populate('followers').populate('following');
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

const toggleFollowIntoDB = async (followingId: string, followerEmail: string) => {
  const following = await User.findById(followingId)
  const follower = await User.isUserExists(followerEmail);

  if (!following || !follower) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (following?.isDeleted || follower?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted.");
  }

  const isFollowing = following.followers.includes(new mongoose.Types.ObjectId(follower?._id));

  if (isFollowing) {
    // Unfollow the user
    await User.findByIdAndUpdate(
      follower?._id,
      { $pull: { following: following?._id } },
      { new: true },
    );
    await User.findByIdAndUpdate(
      following?._id,
      { $pull: { followers: follower?._id } },
      { new: true },
    );

    return null;
  } else {
    // Follow the user
    await User.findByIdAndUpdate(
      follower?._id,
      { $addToSet: { following: following?._id } },
      { new: true },
    );
    await User.findByIdAndUpdate(
      following?._id,
      { $addToSet: { followers: follower?._id } },
      { new: true },
    );

    return null;
  }

}


export const UserService = {
  getUserFromDB,
  getAllUsersFromDB,
  getMeFromDB,
  updateUserInDB,
  deleteUserFromDB,
  toggleFollowIntoDB,
}