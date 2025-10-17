import { BaseService } from '../base/base.service';
import { IEmployee } from './employee.types';
import { Employee } from './employee.model';

export class EmployeeService extends BaseService<IEmployee> {
    constructor() {
        super(Employee)
    }
}