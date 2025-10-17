import { seedDatabase } from '../base/base.seed';
import { User } from './user.model';
import { IUser } from './user.types';

const defaultUsers = [
  {
    userFirstName: 'Rkitech',
    userLastName: 'Superuser',
    userEmail: 'Rkitech.superuser@rkitech.com',
    userPassword: 'string',
    userCreated: Date.now().toString(),
    userProfileImage: '',
  }
];

seedDatabase<IUser>({
  modelName: 'user',
  model: User,
  data: defaultUsers,
  uniqueField: 'userEmail',
  displayField: 'userFirstName',
});