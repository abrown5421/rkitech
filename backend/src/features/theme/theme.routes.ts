import { Router } from 'express';
import { ThemeController } from './theme.controller';

const router = Router();
const themeController = new ThemeController();

router.get('/', themeController.read.bind(themeController));
router.post('/', themeController.create.bind(themeController));
router.patch('/:id/activate', themeController.activate.bind(themeController));
router.put('/:id', themeController.update.bind(themeController));
router.delete('/:id', themeController.delete.bind(themeController));

export default router;
