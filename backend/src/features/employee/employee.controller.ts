import { EmployeeService } from "./employee.service";
import { BaseController } from "../base/base.controller";

export class EmployeeController extends BaseController<any> {
  protected service = new EmployeeService();
  protected resourceName = "Employee";
  protected resourceNamePlural = "employees";
}