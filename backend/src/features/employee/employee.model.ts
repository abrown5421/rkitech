import mongoose, { Schema } from 'mongoose';
import { IEmployee } from './employee.types';

const EmployeeSchema: Schema = new Schema<IEmployee>({
  employeeFirstName: { type: String, required: true },
  employeeLastName: { type: String, required: false },
  employeeEmail: { type: String, required: true },
  employeePassword: { type: String, required: true },
  employeeCreated: { type: String, required: true },
  employeeProfileImage: { type: String, required: false },
  employeeRole: { type: String, required: true },
  employeeTitle: { type: String, required: true },
  employeeBio: { type: String, required: false }
}, { timestamps: true });

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

