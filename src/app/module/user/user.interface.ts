import { Model, Types } from "mongoose";
import { User_Role } from "./user.constant";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordChangedAt?: Date;
  role: 'user' | 'admin';
  gender: 'male' | 'female' | 'other';
  birthday: string;
  profileImage: string;
  isVerified: boolean;
  isDeleted: boolean;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  bio: string;
  subscription: 'free' | 'basic' | 'pro';
  userName: string;
  status: "active" | "block";
  coverImage: string;
  address: string;
}

export interface IUserModel extends Model<IUser> {
  isUserExists(email: string): Promise<IUser>;
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): boolean;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}


export type TUserRole = keyof typeof User_Role;