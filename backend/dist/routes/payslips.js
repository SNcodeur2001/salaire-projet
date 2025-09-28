import express from 'express';
import payslipController from '../controllers/payslipController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router = express.Router();
// All routes require authentication
router.use(requireAuth);
// Get payslip by id
router.get('/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'CAISSIER'), payslipController.getPayslip.bind(payslipController));
// Update payslip
router.put('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), payslipController.updatePayslip.bind(payslipController));
// Get payments for payslip
router.get('/:id/payments', requireRole('SUPER_ADMIN', 'ADMIN', 'CAISSIER'), payslipController.getPayslipPayments.bind(payslipController));
export default router;
//# sourceMappingURL=payslips.js.map