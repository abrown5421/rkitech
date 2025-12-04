import { seedDatabase } from '../base/base.seed';
import { User } from './user.model';
import { IUser } from './user.types';

const defaultUsers: Partial<IUser>[] = [
  {
    userFirstName: 'Rkitech',
    userLastName: 'Superuser',
    userEmail: 'Rkitech.superuser@rkitech.com',
    userPassword: 'string',
    userCreated: Date.now().toString(),
    userProfileImage: '',
    userType: 'employee',
    employeeObject: {
      employeeProfileImage: undefined,
      employeeRole: 'admin',
      employeeTitle: 'Developer',
      employeeBio: '',
    },
  },
  {
    userFirstName: 'John',
    userLastName: 'Doe',
    userEmail: 'john.doe@rkitech.com',
    userPassword: 'string',
    userCreated: Date.now().toString(),
    userProfileImage: '',
    userType: 'user', 
  },
];

export default async () => {
  await seedDatabase<IUser>({
    modelName: 'user',
    model: User,
    data: defaultUsers,
    uniqueField: 'userEmail',
    displayField: 'userFirstName',
  });
};
