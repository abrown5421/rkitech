import type { IEmployees } from "../../../employees/employeesTypes";

export interface AdminAuthState {
  user: IEmployees | null;
}