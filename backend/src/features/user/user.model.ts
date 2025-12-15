import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.types';
import { hashPassword } from '../../utils/password';

const EmployeeSchema = new Schema(
  {
    employeeProfileImage: String,
    employeeRole: { type: String, required: true },
    employeeTitle: { type: String, required: true },
    employeeBio: String,
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    userFirstName: { type: String, required: true },
    userLastName: { type: String },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true, select: false }, 
    userCreated: { type: String, required: true },
    userProfileImage: { type: String },
    userType: { type: String, enum: ['user', 'employee'], required: true },
    employeeObject: { type: EmployeeSchema },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('userPassword')) return next();
  this.userPassword = await hashPassword(this.userPassword);
  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as any;

  if (update?.userPassword) {
    update.userPassword = await hashPassword(update.userPassword);
  }

  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
