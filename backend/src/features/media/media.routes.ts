import { Router } from 'express';
import multer from 'multer';
import { MediaController } from './media.controller';

const router = Router();
const controller = new MediaController();

const upload = multer({ dest: 'uploads/' });

router.get('/tree', controller.getTree);

router.post('/upload', upload.single('file'), controller.upload);

router.put('/rename', controller.rename);

router.put('/replace', upload.single('file'), controller.replace);

router.delete('/', controller.delete);

export default router;
