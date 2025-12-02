import { BaseController } from '../base/base.controller';
import { ElementsService } from './elements.service';

export class ElementsController extends BaseController<any> {
  protected service = new ElementsService();
  protected resourceName = "Elements";
  protected resourceNamePlural = "elements";
}
