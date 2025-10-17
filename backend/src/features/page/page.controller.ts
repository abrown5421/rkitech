import { PageService } from "./page.service";
import { BaseController } from "../base/BaseController";

export class PageController extends BaseController<any> {
  protected service = new PageService();
  protected resourceName = "Page";
  protected resourceNamePlural = "pages";
}