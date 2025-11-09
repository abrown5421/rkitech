import type { IEmployees } from "../../../employees/employeesTypes";

export interface AuthState {
  user: IEmployees | null;
}