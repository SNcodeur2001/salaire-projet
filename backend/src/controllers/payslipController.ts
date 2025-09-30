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
      const { grossSalary, deductions, netSalary, notes } = req.body;

      // Validation détaillée
      if (grossSalary !== undefined && (typeof grossSalary !== 'number' || grossSalary <= 0)) {
        return res.status(400).json({ error: 'Le salaire brut doit être un nombre positif' });
      }
      if (deductions !== undefined && (typeof deductions !== 'number' || deductions < 0)) {
        return res.status(400).json({ error: 'Les charges ne peuvent pas être négatives' });
      }
      if (netSalary !== undefined && (typeof netSalary !== 'number' || netSalary <= 0)) {
        return res.status(400).json({ error: 'Le salaire net doit être un nombre positif' });
      }
      if (notes !== undefined && typeof notes !== 'string') {
        return res.status(400).json({ error: 'Les notes doivent être une chaîne de caractères' });
      }

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

  async downloadPayslipPdf(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const entrepriseId = req.user?.entrepriseId;
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }

      // Get payslip with relations
      const payslip = await payslipService.getPayslipById(id, entrepriseId);

      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="bulletin-${id}.pdf"`);

      // For now, return a simple text response (in real app, generate actual PDF)
      res.send(`PDF Content for payslip ${id}`);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async sendPayslipEmail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const entrepriseId = req.user?.entrepriseId;
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }

      const payslip = await payslipService.getPayslipById(id, entrepriseId);

      // Simulate email sending (in real app, use email service)
      console.log(`Sending email to employee with payslip ${id}`);

      res.json({ message: 'Email envoyé avec succès' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new PayslipController();
