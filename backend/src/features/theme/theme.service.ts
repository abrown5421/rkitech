import { BaseService } from '../base/base.service';
import { Theme } from './theme.model';
import { ITheme } from './theme.types';

export class ThemeService extends BaseService<ITheme> {
  constructor() {
    super(Theme);
  }

  async activateTheme(id: string): Promise<ITheme> {
    await Theme.updateMany({}, { active: false });
    
    const theme = await Theme.findByIdAndUpdate(
      id,
      { active: true },
      { new: true }
    );

    if (!theme) {
      throw new Error('Theme not found');
    }

    return theme;
  }
}