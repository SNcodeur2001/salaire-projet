import express, { Router } from 'express';
import entrepriseController from '../controllers/entrepriseController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router: Router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all entreprises
router.get('/', requireRole('SUPER_ADMIN'), entrepriseController.getEntreprises.bind(entrepriseController));

// Get entreprise by id
router.get('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), entrepriseController.getEntreprise.bind(entrepriseController));

// Create entreprise
router.post('/', requireRole('SUPER_ADMIN'), entrepriseController.createEntreprise.bind(entrepriseController));

// Update entreprise
router.put('/:id', requireRole('SUPER_ADMIN'), entrepriseController.updateEntreprise.bind(entrepriseController));

// Delete entreprise
router.delete('/:id', requireRole('SUPER_ADMIN'), entrepriseController.deleteEntreprise.bind(entrepriseController));

export default router;
