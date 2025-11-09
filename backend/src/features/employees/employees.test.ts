import { BaseCrudTest } from '../base/base.test.helper';
import { IEmployees } from './employees.types';

describe('Employeess API', () => {
  const baseCrudTest = new BaseCrudTest<IEmployees>({
    resourceName: 'employees',
    endpoint: '/api/employees',
    createPayload: {
      employeeFirstName: 'Test Value',
      employeeLastName: 'Test Value',
      employeeEmail: 'Test Value',
      employeePassword: 'Test Value',
      employeeProfileImage: 'Test Value',
      employeeRole: 'Test Value',
      employeeTitle: 'Test Value',
      employeeBio: 'Test Value',
    },
    updatePayload: {
      employeeFirstName: 'Updated Employees Field',
    },
    createExpectations: [
      { field: 'employeeFirstName', value: 'Test Value' },
    ],
    updateExpectations: {
      field: 'employeeFirstName',
      value: 'Updated Employees Field',
    },
  });

  baseCrudTest.runAllTests();
});

function getDefaultTestValue(type: string) {
  switch (type) {
    case 'String': return "'Test Value'";
    case 'Number': return 123;
    case 'Boolean': return true;
    case 'Date': return 'new Date()';
    default: return "'Sample'";
  }
}
