import mongoose, { Schema } from 'mongoose';
import { IEmployees } from './employees.types';

const EmployeesSchema: Schema = new Schema<IEmployees>({
  employeeFirstName: { type: String, required: true },
  employeeLastName: { type: String, required: false },
  employeeEmail: { type: String, required: true },
  employeePassword: { type: String, required: true },
  employeeProfileImage: { type: String, required: false },
  employeeRole: { type: String, required: true },
  employeeTitle: { type: String, required: true },
  employeeBio: { type: String, required: false },
}, { timestamps: true });

export const Employees = mongoose.model<IEmployees>('Employees', EmployeesSchema);
