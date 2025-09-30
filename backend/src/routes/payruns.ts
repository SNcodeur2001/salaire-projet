import express, { Router } from 'express';
import payrunController from '../controllers/payrunController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router: Router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all payruns
router.get('/', requireRole('SUPER_ADMIN', 'ADMIN', 'CAISSIER'), payrunController.getPayruns.bind(payrunController));

// Get payrun by id
router.get('/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'CAISSIER'), payrunController.getPayrun.bind(payrunController));

// Create payrun
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN'), payrunController.createPayrun.bind(payrunController));

// Update payrun status
router.put('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), payrunController.updatePayrun.bind(payrunController));

// Get payslips for payrun
router.get('/:id/payslips', requireRole('SUPER_ADMIN', 'ADMIN', 'CAISSIER'), payrunController.getPayrunPayslips.bind(payrunController));

// Generate payslips for payrun
router.post('/:id/generate', requireRole('SUPER_ADMIN', 'ADMIN'), payrunController.generatePayslips.bind(payrunController));

export default router;
