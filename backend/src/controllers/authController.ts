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

      // Allow creating SUPER_ADMIN without authentication
      if (role === 'SUPER_ADMIN') {
        if (currentUser && currentUser.role !== 'SUPER_ADMIN') {
          return res.status(403).json({ error: 'Seul SUPER_ADMIN peut créer d\'autres SUPER_ADMIN' });
        }
        // For SUPER_ADMIN, entrepriseId should be null
        const result = await authService.register(email, password, role, null);
        return res.json(result);
      }

      // For other roles, authentication is required
      if (!currentUser) {
        return res.status(401).json({ error: 'Authentification requise pour créer cet utilisateur' });
      }

      // Only SUPER_ADMIN can create users with entrepriseId
      if (entrepriseId && currentUser.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Seul SUPER_ADMIN peut créer des utilisateurs pour une entreprise' });
      }

      // If not SUPER_ADMIN, use the current user's entrepriseId
      const finalEntrepriseId = entrepriseId || currentUser.entrepriseId;

      const result = await authService.register(email, password, role, finalEntrepriseId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et password requis' });
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
