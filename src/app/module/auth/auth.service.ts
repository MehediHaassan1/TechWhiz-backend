import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { IUser } from "../user/user.interface"
import User from "../user/user.model"
import { ILogin } from "./auth.interface"
import { createToken } from "./auth.utils"
import config from "../../config"

const registerUserIntoDB = async (payload: IUser) => {

  const user = await User.isUserExists(payload.email)
  if (user) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists!')
  }

  const isPhoneExists = await User.findOne({ phone: payload.phone })
  if (isPhoneExists) {
    throw new AppError(httpStatus.CONFLICT, 'Phone number already exists!')
  }

  const result = await User.create(payload);
  return result;
}


const loginUserIntoDB = async (payload: ILogin) => {
  const user = await User.isUserExists(payload.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is deleted!')
  }

  const isPasswordMatch = await User.isPasswordMatched(payload.password, user?.password);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Password!');
  }


  // create token
  const jwtPayload = {
    email: user.email as string,
    role: user.role as string,
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_secret_expires_in as string
  )


  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_secret_expires_in as string
  )

  return {
    user,
    accessToken,
    refreshToken,
  }

}


export const AuthService = {
  registerUserIntoDB,
  loginUserIntoDB,
}