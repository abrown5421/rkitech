import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';
import { BaseResponse } from '../../middleware/response.middleware';

const userService = new UserService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error('Invalid credentials');
      }

      const user = await userService.login(email, password);

      res.json(
        BaseResponse.Success('Login successful', user)
      );
    } catch (err) {
      next(err);
    }
  }
}
