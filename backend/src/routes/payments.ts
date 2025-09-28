import express, { Router } from 'express';
import paymentController from '../controllers/paymentController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router: Router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Create payment
router.post('/', requireRole('SUPER_ADMIN', 'CAISSIER'), paymentController.createPayment.bind(paymentController));

// Get payment by id
router.get('/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'CAISSIER'), paymentController.getPayment.bind(paymentController));

// Get payment receipt
router.get('/:id/receipt', requireRole('SUPER_ADMIN', 'ADMIN', 'CAISSIER'), paymentController.getPaymentReceipt.bind(paymentController));

export default router;
