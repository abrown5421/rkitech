import { BaseController } from '../base/base.controller';
import { EmployeesService } from './employees.service';

export class EmployeesController extends BaseController<any> {
  protected service = new EmployeesService();
  protected resourceName = "Employees";
  protected resourceNamePlural = "employees";
}
