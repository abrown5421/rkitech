import { Router } from 'express';
import { EmployeesController } from './employees.controller';

const router = Router();
const employeesController = new EmployeesController();

router.get('/', employeesController.read.bind(employeesController));
router.post('/', employeesController.create.bind(employeesController));
router.put('/:id', employeesController.update.bind(employeesController));
router.delete('/:id', employeesController.delete.bind(employeesController));

export default router;
