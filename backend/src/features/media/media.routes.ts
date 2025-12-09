import { Router } from 'express';
import { MediaController } from './media.controller';

const router = Router();
const controller = new MediaController();

router.get('/tree', controller.getTree);

export default router;
