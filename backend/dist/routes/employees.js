import express from 'express';
import employeeController from '../controllers/employeeController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router = express.Router();
// All routes require authentication
router.use(requireAuth);
// Get all employees
router.get('/', requireRole('SUPER_ADMIN', 'ADMIN', 'CAISSIER', 'VIGILE'), employeeController.getEmployees.bind(employeeController));
// Get employee by id
router.get('/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'CAISSIER'), employeeController.getEmployee.bind(employeeController));
// Create employee
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN'), employeeController.createEmployee.bind(employeeController));
// Update employee
router.put('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), employeeController.updateEmployee.bind(employeeController));
// Activate/Deactivate employee
router.patch('/:id/activate', requireRole('SUPER_ADMIN', 'ADMIN'), employeeController.activateEmployee.bind(employeeController));
// Filter employees
router.post('/filter', requireRole('SUPER_ADMIN', 'ADMIN', 'CAISSIER'), employeeController.filterEmployees.bind(employeeController));
export default router;
//# sourceMappingURL=employees.js.map