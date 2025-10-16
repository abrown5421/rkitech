import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { BaseResponse } from "../base/BaseResponse";
import { BaseError } from "../base/BaseError";

const userService = new UserService();

export class UserController {
  async read(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = req.query;
        const users = await userService.read(filters);

        res.json(BaseResponse.Success("Fetched users successfully", users));
    } catch (error) {
        next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await userService.create(req.body);
      res
        .status(201)
        .json(BaseResponse.Created("User created successfully", newUser));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await userService.update(req.params.id, req.body);
      if (!updatedUser) throw BaseError.NotFound("User", req.params.id);
      res.json(BaseResponse.Success("User updated successfully", updatedUser));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedUser = await userService.delete(req.params.id);
      if (!deletedUser) throw BaseError.NotFound("User", req.params.id);
      res.json(BaseResponse.Success("User deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
