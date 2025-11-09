export interface IEmployees {
  _id?: string;
  employeeFirstName: string;
  employeeLastName?: string;
  employeeEmail: string;
  employeePassword: string;
  employeeProfileImage?: string;
  employeeRole: string;
  employeeTitle: string;
  employeeBio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}