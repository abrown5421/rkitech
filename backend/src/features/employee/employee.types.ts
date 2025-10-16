import { Document } from 'mongoose'

export interface IEmployee extends Document {
    employeeFirstName: string,
    employeeLastName: string,
    employeeEmail: string,
    employeePassword: string,
    employeeCreated: string,
    employeeProfileImage: string,
    employeeRole: string,
    employeeTitle: string,
    employeeBio: string
}