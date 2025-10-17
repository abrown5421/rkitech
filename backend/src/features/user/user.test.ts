import { BaseCrudTest } from "../base/base.test.helper";
import { IUser } from "./user.types";

describe('Users API', () => {
  const baseCrudTest = new BaseCrudTest<IUser>({
    resourceName: 'user',
    endpoint: '/api/users',
    createPayload: {
      userFirstName: 'Test',
      userLastName: 'User',
      userEmail: 'test123@gmail.com',
      userPassword: 'hashedPassHere',
      userCreated: Date.now().toString(),
      userProfileImage: '',
    },
    updatePayload: {
      userFirstName: 'Test',
    },
    createExpectations: [
      { field: 'userFirstName', value: 'Test' },
      { field: 'userLastName', value: 'User' },
    ],
    updateExpectations: {
      field: 'userFirstName',
      value: 'Test',
    },
  });

  baseCrudTest.runAllTests();

  // Add any user-specific tests here
});