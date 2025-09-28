import { Request, Response } from 'express';
import payrunService from '../services/payrunService.js';

export class PayrunController {
  async getPayruns(req: Request, res: Response) {
    try {
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.query.entrepriseId as string;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const payruns = await payrunService.getAllPayruns(entrepriseId);
      res.json(payruns);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPayrun(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.query.entrepriseId as string || req.body.entrepriseId;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const payrun = await payrunService.getPayrunById(id, entrepriseId);
      res.json(payrun);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createPayrun(req: Request, res: Response) {
    try {
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.body.entrepriseId;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const payrun = await payrunService.createPayrun({ ...req.body, entrepriseId });
      res.status(201).json(payrun);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updatePayrun(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.body.entrepriseId;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const payrun = await payrunService.updatePayrunStatus(id, entrepriseId, status);
      res.json(payrun);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPayrunPayslips(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.query.entrepriseId as string || req.body.entrepriseId;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const payslips = await payrunService.getPayrunPayslips(id, entrepriseId);
      res.json(payslips);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new PayrunController();
