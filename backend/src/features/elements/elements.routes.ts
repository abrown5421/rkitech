import { Router } from 'express';
import { ElementsController } from './elements.controller';

const router = Router();
const elementsController = new ElementsController();

router.get('/', elementsController.read.bind(elementsController));
router.post('/', elementsController.create.bind(elementsController));
router.put('/:id', elementsController.update.bind(elementsController));
router.delete('/:id', elementsController.delete.bind(elementsController));

export default router;
