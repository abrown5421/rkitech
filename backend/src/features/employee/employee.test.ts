import { BaseCrudTest } from '../base/base.test.helper';
import { IEmployee } from './employee.types';

describe('Employees API', () => {
  const baseCrudTest = new BaseCrudTest<IEmployee>({
    resourceName: 'employee',
    endpoint: '/api/employees',
    createPayload: {
      employeeFirstName: 'Test',
      employeeLastName: 'Employee',
      employeeEmail: 'Test.Employee@rkitech.com',
      employeePassword: 'string',
      employeeCreated: Date.now().toString(),
      employeeProfileImage: '',
      employeeRole: 'Test',
      employeeTitle: 'Test Title',
      employeeBio: '',
    },
    updatePayload: {
      employeeFirstName: 'Testing',
    },
    createExpectations: [
      { field: 'employeeFirstName', value: 'Test' },
      { field: 'employeeLastName', value: 'Employee' },
    ],
    updateExpectations: {
      field: 'employeeFirstName',
      value: 'Testing',
    },
  });

  baseCrudTest.runAllTests();

  // Add any employee-specific tests here
});