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

  async getPaymentReceipt(id: string, res: any) {
    const payment = await this.getPaymentById(id);

    // Get full payment details with relations
    const paymentWithDetails = await prisma.payment.findUnique({
      where: { id },
      include: {
        payslip: {
          include: {
            employee: true,
            cycle: true
          }
        },
        caissier: true
      }
    });

    if (!paymentWithDetails) {
      throw new Error('Paiement non trouvé');
    }

    // Get entreprise info
    const entreprise = await prisma.entreprise.findUnique({
      where: { id: paymentWithDetails.payslip.employee.entrepriseId }
    });

    if (!entreprise) {
      throw new Error('Entreprise non trouvée');
    }

    // Generate PDF
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="recu-paiement-${id}.pdf"`);

    doc.pipe(res);

    const { generatePaymentReceiptPdf } = await import('../utils/pdfGenerator.js');
    generatePaymentReceiptPdf(doc, {
      payment: paymentWithDetails,
      entreprise
    });
  }

  async getPayments(filters: { entrepriseId?: string } = {}) {
    return await paymentRepository.findAll(filters);
  }
}

export default new PaymentService();
