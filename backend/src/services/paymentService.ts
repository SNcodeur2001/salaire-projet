import { PrismaClient } from '@prisma/client';
import paymentRepository from '../repositories/paymentRepository.js';

const prisma = new PrismaClient();

export class PaymentService {
  async createPayment(data: {
    payslipId: string;
    caissierId: string;
    amount: number;
    mode: string;
    receiptUrl?: string;
  }) {
    // Validation
    if (!data.payslipId || !data.caissierId || data.amount <= 0 || !data.mode) {
      throw new Error('Champs requis manquants ou invalides');
    }

    // Create payment
    const payment = await paymentRepository.create(data);

    // Update payslip status
    const totalPaid = await paymentRepository.getTotalPaid(data.payslipId);
    const payslip = await prisma.payslip.findUnique({ where: { id: data.payslipId } });
    if (payslip) {
      const netSalary = payslip.netSalary;
      if (totalPaid >= netSalary) {
        await paymentRepository.updatePayslipStatus(data.payslipId, 'PAYE');
      } else if (totalPaid > 0) {
        await paymentRepository.updatePayslipStatus(data.payslipId, 'PARTIEL');
      }
    }

    return payment;
  }

  async getPaymentById(id: string) {
    const payment = await paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Paiement non trouvé');
    }
    return payment;
  }

  async getPaymentReceipt(id: string) {
    const payment = await this.getPaymentById(id);
    // Simulate PDF URL
    return { receiptUrl: `https://example.com/receipts/${id}.pdf` };
  }
}

export default new PaymentService();
