import type { IUser } from "../../frontend/user/userTypes";

export interface AuthState {
  user: IUser | null;
}