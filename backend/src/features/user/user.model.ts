import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.types';

const UserSchema: Schema = new Schema<IUser>({
  userFirstName: { type: String, required: true },
  userLastName: { type: String, required: false },
  userEmail: { type: String, required: true },
  userPassword: { type: String, required: true },
  userCreated: { type: String, required: true },
  userProfileImage: { type: String, required: false }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);

