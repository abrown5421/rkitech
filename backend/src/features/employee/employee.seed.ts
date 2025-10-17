import { seedDatabase } from '../base/base.seed';
import { Employee } from './employee.model';
import { IEmployee } from './employee.types';

const defaultEmployees = [
  {
    employeeFirstName: 'Rkitech',
    employeeLastName: 'Superemployee',
    employeeEmail: 'Rkitech.superemployee@rkitech.com',
    employeePassword: 'string',
    employeeCreated: Date.now().toString(),
    employeeProfileImage: '',
    employeeRole: 'Admin',
    employeeTitle: 'Developer',
    employeeBio: ''
  }
];

seedDatabase<IEmployee>({
  modelName: 'employee',
  model: Employee,
  data: defaultEmployees,
  uniqueField: 'employeeEmail',
  displayField: 'employeeFirstName',
});