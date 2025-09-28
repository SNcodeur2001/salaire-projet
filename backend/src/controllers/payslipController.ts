import { Request, Response } from 'express';
import payslipService from '../services/payslipService.js';

export class PayslipController {
  async getPayslips(req: Request, res: Response) {
    try {
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.query.entrepriseId as string;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const payslips = await payslipService.getAllPayslips(entrepriseId);
      res.json(payslips);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPayslip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.query.entrepriseId as string;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const payslip = await payslipService.getPayslipById(id, entrepriseId);
      res.json(payslip);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async updatePayslip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.query.entrepriseId as string;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const payslip = await payslipService.updatePayslip(id, entrepriseId, req.body);
      res.json(payslip);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPayslipPayments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const entrepriseId = req.user?.entrepriseId;
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const payments = await payslipService.getPayslipPayments(id, entrepriseId);
      res.json(payments);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new PayslipController();
