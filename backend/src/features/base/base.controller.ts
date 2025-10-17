import { Request, Response, NextFunction } from "express";
import { BaseResponse } from "../../middleware/response.middleware";
import { BaseError } from "../../middleware/error.middleware";

export abstract class BaseController<T> {
  protected abstract service: any;
  protected abstract resourceName: string;
  protected abstract resourceNamePlural: string;

  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const data = await this.service.read(filters);
      res.json(
        BaseResponse.Success(
          `Fetched ${this.resourceNamePlural} successfully`,
          data
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newResource = await this.service.create(req.body);
      res
        .status(201)
        .json(
          BaseResponse.Created(
            `${this.resourceName} created successfully`,
            newResource
          )
        );
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedResource = await this.service.update(
        req.params.id,
        req.body
      );
      if (!updatedResource)
        throw BaseError.NotFound(this.resourceName, req.params.id);
      res.json(
        BaseResponse.Success(
          `${this.resourceName} updated successfully`,
          updatedResource
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedResource = await this.service.delete(req.params.id);
      if (!deletedResource)
        throw BaseError.NotFound(this.resourceName, req.params.id);
      res.json(
        BaseResponse.Success(`${this.resourceName} deleted successfully`)
      );
    } catch (error) {
      next(error);
    }
  }
}