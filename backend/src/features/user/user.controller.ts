import { UserService } from "./user.service";
import { BaseController } from "../base/base.controller";

export class UserController extends BaseController<any> {
  protected service = new UserService();
  protected resourceName = "User";
  protected resourceNamePlural = "users";
}