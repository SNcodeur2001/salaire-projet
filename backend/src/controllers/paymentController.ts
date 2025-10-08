import { Request, Response } from 'express';
import paymentService from '../services/paymentService.js';

export class PaymentController {
  async createPayment(req: Request, res: Response) {
    try {
      const caissierId = req.user?.userId;
      if (!caissierId) {
        return res.status(400).json({ error: 'Caissier non trouvé' });
      }
      const { entrepriseId, ...paymentData } = req.body;
      const payment = await paymentService.createPayment({ ...paymentData, caissierId });
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await paymentService.getPaymentById(id);
      res.json(payment);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getPaymentReceipt(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await paymentService.getPaymentReceipt(id, res);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getPayments(req: Request, res: Response) {
    try {
      const { entrepriseId } = req.query;
      const filters: { entrepriseId?: string } = {};
      if (entrepriseId && typeof entrepriseId === 'string') {
        filters.entrepriseId = entrepriseId;
      }
      const payments = await paymentService.getPayments(filters);
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PaymentController();
