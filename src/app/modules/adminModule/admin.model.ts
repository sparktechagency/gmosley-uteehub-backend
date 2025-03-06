import mongoose from 'mongoose';
import IAdmin from './admin.interface';
import validator from 'validator';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required!'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: [8, 'Password must be at least 8 characters'],
      required: [true, 'Password is required!'],
    },
    role: {
      type: String,
      enum: ['super-admin', 'admin'],
      default: 'admin',
    },
    status: {
      type: String,
      enum: ['active', 'blocked', 'disabled'],
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
  },
  {
    timestamps: true,
  },
);

adminSchema.pre('save', function (next) {
  const saltRounds = 10;
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }

  if (this.isModified('verification.code') && this.verification?.code) {
    this.verification.code = bcrypt.hashSync(this.verification.code, saltRounds);
  }

  next();
});

adminSchema.methods.comparePassword = function (adminPlanePassword: string) {
  console.log(adminPlanePassword, this.password)
  return bcrypt.compareSync(adminPlanePassword, this.password);
};

adminSchema.methods.compareVerificationCode = function (adminPlaneCode: string) {
  return bcrypt.compareSync(adminPlaneCode, this.verification.code);
};

const Admin = mongoose.model<IAdmin>('admin', adminSchema);
export default Admin;
