import { Document } from 'mongoose';

export interface IEmployees extends Document {
  employeeFirstName: string;
  employeeLastName: string | undefined;
  employeeEmail: string;
  employeePassword: string;
  employeeProfileImage: string | undefined;
  employeeRole: string;
  employeeTitle: string;
  employeeBio: string | undefined;
}
