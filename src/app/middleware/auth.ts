import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import config from "../config";
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from "../module/user/user.model";
import { TUserRole } from "../module/user/user.interface";

const authHandler = (...userRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const authorization = req.headers.authorization
    const token = authorization?.split(' ')[1]


    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication failed!')
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Jwt expired");
    }


    const { email, role, iat } = decoded;

    const existingUser = await User.isUserExists(email);
    if (!existingUser) {
      throw new AppError(httpStatus.FORBIDDEN, 'Forbidden access!')
    }

    if (existingUser.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
    }

    if (
      existingUser.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        existingUser.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    if (userRoles && !userRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You have no access to this route!')
    }

    req.user = decoded

    next();
  })
}

export default authHandler;