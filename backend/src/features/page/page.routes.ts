import { Router } from 'express';
import { PageController } from './page.controller';

const router = Router();
const pageController = new PageController();

router.get('/', pageController.read.bind(pageController));
router.post('/', pageController.create.bind(pageController));
router.put('/:id', pageController.update.bind(pageController));
router.delete('/:id', pageController.delete.bind(pageController));

export default router;
