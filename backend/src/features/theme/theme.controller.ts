import { BaseController } from '../base/base.controller';
import { ThemeService } from './theme.service';

export class ThemeController extends BaseController<any> {
  protected service = new ThemeService();
  protected resourceName = 'Theme';
  protected resourceNamePlural = 'themes';
}
