import bcrypt from 'bcrypt';
import { model, Schema } from "mongoose";
import { IUser, IUserModel } from "./user.interface";
import config from '../../config';


const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    unique: true,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: 'https://i.ibb.co.com/vkVW6s0/download.png',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  followers: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    trim: true,
    default: '',
  },
  subscription: {
    type: String,
    enum: ['normal', 'premium'],
    default: 'normal',
  },
}, {
  timestamps: true,
});


// hashed the password field
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round)
  )
  next();
})

// remove the password field in the response
userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  }
});

userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});


userSchema.statics.isUserExists = async function (email) {
  const user = await User.findOne({ email }).select('+password');
  return user;
}

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}


const User = model<IUser, IUserModel>('User', userSchema);
export default User;


