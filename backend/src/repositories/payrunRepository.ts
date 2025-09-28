import { PrismaClient, PayrollCycle, PayrunStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class PayrunRepository {
  async findAll(entrepriseId: string): Promise<PayrollCycle[]> {
    return await prisma.payrollCycle.findMany({
      where: { entrepriseId },
      include: { payslips: true, entreprise: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, entrepriseId: string): Promise<PayrollCycle | null> {
    return await prisma.payrollCycle.findFirst({
      where: { id, entrepriseId },
      include: { payslips: true, entreprise: true },
    });
  }

  async create(data: {
    period: string;
    entrepriseId: string;
  }): Promise<PayrollCycle> {
    return await prisma.payrollCycle.create({ data });
  }

  async updateStatus(id: string, entrepriseId: string, status: PayrunStatus): Promise<PayrollCycle | null> {
    return await prisma.payrollCycle.updateMany({
      where: { id, entrepriseId },
      data: { status },
    }).then(() => this.findById(id, entrepriseId));
  }

  async getPayslips(id: string, entrepriseId: string) {
    const payrun = await this.findById(id, entrepriseId);
    if (!payrun) return null;
    return await prisma.payslip.findMany({
      where: { cycleId: id },
      include: { employee: true, payments: true },
    });
  }
}

export default new PayrunRepository();
