import { Document } from 'mongoose'

export interface IUser extends Document {
    userFirstName: string,
    userLastName: string,
    userEmail: string,
    userPassword: string,
    userCreated: string,
    userProfileImage: string,
    userType: 'user' | 'employee',
    employeeObject?: Employee
}

export interface Employee {
    employeeProfileImage: string | undefined;
    employeeRole: string;
    employeeTitle: string;
    employeeBio: string | undefined;
}