import { BaseController } from "../base/base.controller";
import { ConfigService } from "./configurations.service";

export class ConfigController extends BaseController<any> {
  protected service = new ConfigService();
  protected resourceName = "Configuration";
  protected resourceNamePlural = "configurations";
}
