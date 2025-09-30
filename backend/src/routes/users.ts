import express, { Router } from 'express';
import userController from '../controllers/userController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router: Router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all users (SUPER_ADMIN only)
router.get('/', requireRole('SUPER_ADMIN'), userController.getUsers.bind(userController));

// Get user by id
router.get('/:id', requireRole('SUPER_ADMIN'), userController.getUser.bind(userController));

// Update user
router.put('/:id', requireRole('SUPER_ADMIN'), userController.updateUser.bind(userController));

// Delete user
router.delete('/:id', requireRole('SUPER_ADMIN'), userController.deleteUser.bind(userController));

export default router;