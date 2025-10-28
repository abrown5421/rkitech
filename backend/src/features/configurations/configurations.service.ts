import { BaseService } from "../base/base.service";
import { Config } from "./configurations.model";
import { IConfiguration } from "./configurations.types";


export class ConfigService extends BaseService<IConfiguration> {
  constructor() {
    super(Config);
  }
}
