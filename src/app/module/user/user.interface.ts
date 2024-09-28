import { Model } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  gender: 'male' | 'female';
  birthday: string;
  profileImage: string;
  isVerified: boolean;
  isDeleted: boolean;
  followers: number;
  following: number;
  bio: string;
  subscription: 'normal' | 'premium';
  userName: string;
}

export interface IUserModel extends Model<IUser> {
  isUserExists(email: string): Promise<IUser>;
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): boolean;
}
