import mongoose, { Types } from 'mongoose';
import IUser from './user.interface';
import validator from 'validator';
import bcrypt from 'bcrypt';

export const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required!'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: (props: { value: string }) => `${props.value} is not a valid email!`,
      },
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: [8, 'Password must be at least 8 characters'],
      required: [true, 'Password is required!'],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'active', 'blocked', 'disabled'],
        message: '{VALUE} is not accepted as a status value. Use pending/active/blocked/disabled.',
      },
      default: 'active',
    },
    verification: {
      code: {
        type: String,
        default: null,
      },
      expireDate: {
        type: Date,
        default: null,
      },
    },
    stripeOnboardingLink: {
      type: String,
      default: null,
    },
    isTransferActive: {
      type: Boolean,
      default: false,
    },
    isSocial: {
      type: Boolean,
      default: false,
    },
    fcmToken: {
      type: String,
      default: null,
    },
    profile: {
      role: {
        type: String,
        enum: ['client', 'vendor'],
        default: 'client',
      },
      id: {
        type: Types.ObjectId,
        refPath: 'profile.role',
        unique: true,
      },
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    stripeAccountId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function (next) {
  const saltRounds = 10;
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }

  if (this.isModified('verification.code') && this.verification?.code) {
    this.verification.code = bcrypt.hashSync(this.verification.code, saltRounds);
  }

  next();
});

userSchema.methods.comparePassword = function (userPlanePassword: string) {
  return bcrypt.compareSync(userPlanePassword, this.password);
};

userSchema.methods.compareVerificationCode = function (userPlaneCode: string) {
  return bcrypt.compareSync(userPlaneCode, this.verification.code);
};

// userSchema.index({
// firstName: 'text',
// lastName: 'text',
//   email: 'text',
//   phone: 'text',
// });

const User = mongoose.model<IUser>('user', userSchema);
export default User;
