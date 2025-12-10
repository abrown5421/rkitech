import { Request, Response, NextFunction } from 'express';
import { BaseResponse } from '../../middleware/response.middleware';
import { MediaService } from './media.service';

export class MediaController {
  private service = new MediaService();
  private resourceName = "Media";

  getTree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tree = this.service.getMediaTree();
      res.json(BaseResponse.Success("Fetched media tree", tree));
    } catch (error) {
      next(error);
    }
  };

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const folder = req.body.folder || '';
      const result = await this.service.uploadFile(req.file!, folder);
      res.json(BaseResponse.Created("File uploaded", result));
    } catch (error) {
      next(error);
    }
  };

  rename = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPath, newName } = req.body;

      const result = this.service.renameFile(oldPath, newName);
      res.json(BaseResponse.Success("File renamed", result));
    } catch (error) {
      next(error);
    }
  };

  replace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { existingPath } = req.body;

      const result = this.service.replaceFile(existingPath, req.file!);
      res.json(BaseResponse.Success("File replaced", result));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { path: filePath } = req.body;

      const result = this.service.deleteFile(filePath);
      res.json(BaseResponse.Success("File deleted", result));
    } catch (error) {
      next(error);
    }
  };
}
