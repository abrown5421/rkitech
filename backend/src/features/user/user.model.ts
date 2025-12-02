import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.types';

const EmployeeSchema: Schema = new Schema({
  employeeProfileImage: { type: String, required: false },
  employeeRole: { type: String, required: true },
  employeeTitle: { type: String, required: true },
  employeeBio: { type: String, required: false },
}, { _id: false });

const UserSchema: Schema = new Schema<IUser>({
  userFirstName: { type: String, required: true },
  userLastName: { type: String, required: false },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  userCreated: { type: String, required: true },
  userProfileImage: { type: String, required: false },
  userType: { type: String, enum: ['user', 'employee'], required: true },
  employeeObject: { type: EmployeeSchema, required: false },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
