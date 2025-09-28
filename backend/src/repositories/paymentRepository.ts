import { PrismaClient, Payment, PayslipStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class PaymentRepository {
  async create(data: {
    payslipId: string;
    caissierId: string;
    amount: number;
    mode: string;
    receiptUrl?: string;
  }): Promise<Payment> {
    return await prisma.payment.create({ data });
  }

  async findById(id: string): Promise<Payment | null> {
    return await prisma.payment.findUnique({
      where: { id },
      include: { payslip: true, caissier: true },
    });
  }

  async updatePayslipStatus(payslipId: string, status: PayslipStatus): Promise<void> {
    await prisma.payslip.update({
      where: { id: payslipId },
      data: { status },
    });
  }

  async getTotalPaid(payslipId: string): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: { payslipId },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }
}

export default new PaymentRepository();
