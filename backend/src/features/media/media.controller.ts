import { Request, Response, NextFunction } from 'express';
import { MediaService } from './media.service';
import { BaseResponse } from '../../middleware/response.middleware';

export class MediaController {
  private service = new MediaService();

  getTree = (req: Request, res: Response, next: NextFunction) => {
    try {
      const tree = this.service.getTree();
      res.json(BaseResponse.Success('Fetched media folder structure', tree));
    } catch (error) {
      next(error);
    }
  };
}
