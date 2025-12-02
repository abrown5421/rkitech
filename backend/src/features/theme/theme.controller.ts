import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../base/base.controller';
import { ThemeService } from './theme.service';

export class ThemeController extends BaseController<any> {
  protected service = new ThemeService();
  protected resourceName = 'Theme';
  protected resourceNamePlural = 'themes';

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const theme = await this.service.activateTheme(id);
      
      res.status(200).json({
        success: true,
        data: theme,
        message: `${this.resourceName} activated successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}