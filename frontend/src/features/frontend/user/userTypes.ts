export interface IEmployee {
  employeeProfileImage?: string;
  employeeRole: string;
  employeeTitle: string;
  employeeBio?: string;
}

export interface IUser {
  _id: string;
  userFirstName: string;
  userLastName?: string;
  userEmail: string;
  userCreated: string;
  userProfileImage?: string;
  userType: 'user' | 'employee';
  employeeObject?: IEmployee;
  createdAt: string;
  updatedAt: string;
}
