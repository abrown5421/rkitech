import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { BaseController } from '../base/base.controller';
import { BaseResponse } from '../../middleware/response.middleware';

export class UserController extends BaseController<any> {
  protected service = new UserService();
  protected resourceName = "User";
  protected resourceNamePlural = "users";

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.service.login(email, password);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }).json({ user });
    } catch (err) {
      next(err);
    }
  }
}
