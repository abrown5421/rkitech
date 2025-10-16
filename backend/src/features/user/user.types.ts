import { Document } from 'mongoose'

export interface IUser extends Document {
    userFirstName: string,
    userLastName: string,
    userEmail: string,
    userPassword: string,
    userCreated: string,
    userProfileImage: string,
}