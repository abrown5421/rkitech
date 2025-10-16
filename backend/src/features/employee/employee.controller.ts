import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "./employee.service";
import { BaseResponse } from "../base/BaseResponse";
import { BaseError } from "../base/BaseError";

const employeeService = new EmployeeService();

export class EmployeeController {
  async read(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = req.query;
        const employees = await employeeService.read(filters);

        res.json(BaseResponse.Success("Fetched employees successfully", employees));
    } catch (error) {
        next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newEmployee = await employeeService.create(req.body);
      res
        .status(201)
        .json(BaseResponse.Created("Employee created successfully", newEmployee));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedEmployee = await employeeService.update(req.params.id, req.body);
      if (!updatedEmployee) throw BaseError.NotFound("Employee", req.params.id);
      res.json(BaseResponse.Success("Employee updated successfully", updatedEmployee));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedEmployee = await employeeService.delete(req.params.id);
      if (!deletedEmployee) throw BaseError.NotFound("Employee", req.params.id);
      res.json(BaseResponse.Success("Employee deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
