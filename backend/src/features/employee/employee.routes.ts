import { Router } from 'express';
import { EmployeeController } from './employee.controller';

const router = Router();
const employeeController = new EmployeeController();

router.get('/', employeeController.read.bind(employeeController));
router.post('/', employeeController.create.bind(employeeController));
router.put('/:id', employeeController.update.bind(employeeController));
router.delete('/:id', employeeController.delete.bind(employeeController));

export default router;
