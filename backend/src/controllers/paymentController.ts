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
      const receipt = await paymentService.getPaymentReceipt(id);
      res.json(receipt);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new PaymentController();
