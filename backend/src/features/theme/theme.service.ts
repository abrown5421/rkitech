import { BaseService } from '../base/base.service';
import { Theme } from './theme.model';
import { ITheme } from './theme.types';

export class ThemeService extends BaseService<ITheme> {
  constructor() {
    super(Theme);
  }
}
