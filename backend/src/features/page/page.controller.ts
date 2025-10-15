import { NextFunction, Request, Response } from "express";
import { PageService } from "./page.service";
import { BaseError } from "../base/BaseError";
import { BaseResponse } from "../base/BaseResponse";

const pageService = new PageService();

export class PageController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = req.query;
        const pages = await pageService.getAll(filters);

        res.json(BaseResponse.Success("Fetched pages successfully", pages));
    } catch (error) {
        next(error);
    }
  }

  async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const page = await pageService.getById(req.params.id);
      if (!page) throw BaseError.NotFound("Page", req.params.id);
      res.json(BaseResponse.Success("Page retrieved successfully", page));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newPage = await pageService.create(req.body);
      res
        .status(201)
        .json(BaseResponse.Created("Page created successfully", newPage));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedPage = await pageService.update(req.params.id, req.body);
      if (!updatedPage) throw BaseError.NotFound("Page", req.params.id);
      res.json(BaseResponse.Success("Page updated successfully", updatedPage));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedPage = await pageService.delete(req.params.id);
      if (!deletedPage) throw BaseError.NotFound("Page", req.params.id);
      res.json(BaseResponse.Success("Page deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
