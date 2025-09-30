import { Request, Response } from 'express';
import authService from '../services/authService.js';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, role, entrepriseId } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et password requis' });
      }

      const currentUser = req.user;

      // Authentication is now required for all user creation
      if (!currentUser) {
        return res.status(401).json({ error: 'Authentification requise pour créer un utilisateur' });
      }

      // Only SUPER_ADMIN can create SUPER_ADMIN users
      if (role === 'SUPER_ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Seul SUPER_ADMIN peut créer d\'autres SUPER_ADMIN' });
      }

      // Only SUPER_ADMIN can create users for other entreprises
      if (entrepriseId && currentUser.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Seul SUPER_ADMIN peut créer des utilisateurs pour une entreprise' });
      }

      // For SUPER_ADMIN, entrepriseId should be null
      const finalEntrepriseId = role === 'SUPER_ADMIN' ? null : (entrepriseId || currentUser.entrepriseId);

      const result = await authService.register(email, password, role, finalEntrepriseId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validation détaillée
      if (!email) {
        return res.status(400).json({ error: 'L\'adresse email est requise' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Le mot de passe est requis' });
      }
      if (typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Format d\'email invalide' });
      }
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Non authentifié' });
      }

      const user = await authService.me(userId);
      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();
