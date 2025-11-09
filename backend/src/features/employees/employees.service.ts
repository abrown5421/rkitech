import { BaseService } from '../base/base.service';
import { Employees } from './employees.model';
import { IEmployees } from './employees.types';

export class EmployeesService extends BaseService<IEmployees> {
  constructor() {
    super(Employees);
  }
}
