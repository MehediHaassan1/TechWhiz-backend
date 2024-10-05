import bcrypt from 'bcrypt';
import { model, Schema } from "mongoose";
import { IUser, IUserModel } from "./user.interface";
import config from '../../config';

const generateRandomNumber = () => {
  return Math.floor(0 + Math.random() * 9000);
};


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
  passwordChangedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  bio: {
    type: String,
    trim: true,
    default: '',
  },
  subscription: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
  status: {
    type: String,
    enum: ["active", "block"],
    default: "active",
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
    default: '',
  },
  address: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});


userSchema.pre('save', function (next) {
  if (!this.userName) {
    const randomNum = generateRandomNumber();
    const formattedName = this.name.replace(/\s+/g, '').toLowerCase();
    this.userName = `tw_${formattedName}_${randomNum}`;
  }
  next();
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

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: number,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};


const User = model<IUser, IUserModel>('User', userSchema);
export default User;


