import bcrypt from 'bcrypt';
import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { IUser } from "../user/user.interface"
import User from "../user/user.model"
import { ILogin } from "./auth.interface"
import { createToken, verifyToken } from "./auth.utils"
import config from "../../config"
import { JwtPayload } from 'jsonwebtoken';

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

  if (user?.status === "block") {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!')
  }

  const isPasswordMatch = await User.isPasswordMatched(payload.password, user?.password);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid Password!');
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

  console.log(jwtPayload);

  return {
    user,
    accessToken,
    refreshToken,
  }

}


const changePasswordIntoDB = async (
  userData: JwtPayload,
  oldPassword: string, newPassword: string
) => {
  const user = await User.isUserExists(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user?.status === "block") {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!')
  }

  if (!(await User.isPasswordMatched(oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_round)
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
    { new: true }
  );

  return null;
};


const refreshTokenFromDB = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string)

  const { email, iat } = decoded;

  const user = await User.isUserExists(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user?.status === "block") {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!')
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_secret_expires_in as string,
  );

  return {
    accessToken,
  };
};


export const AuthService = {
  registerUserIntoDB,
  loginUserIntoDB,
  changePasswordIntoDB,
  refreshTokenFromDB,
}