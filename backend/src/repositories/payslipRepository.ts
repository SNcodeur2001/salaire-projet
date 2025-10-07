import { PrismaClient, Payslip, PayslipStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class PayslipRepository {
  async create(data: {
    employeeId: string;
    cycleId: string;
    grossSalary: number;
    deductions: number;
    netSalary: number;
    daysWorked?: number | null;
    hoursWorked?: number | null;
  }): Promise<Payslip> {
    return await prisma.payslip.create({ data });
  }

  async findAllByEntreprise(entrepriseId: string): Promise<Payslip[]> {
    return await prisma.payslip.findMany({
      where: { employee: { entrepriseId } },
      include: { employee: true, cycle: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, entrepriseId: string): Promise<Payslip | null> {
    return await prisma.payslip.findFirst({
      where: { id, employee: { entrepriseId } },
      include: { employee: true, cycle: true, payments: true },
    });
  }

  async update(id: string, entrepriseId: string, data: Partial<Payslip>): Promise<Payslip | null> {
    return await prisma.payslip.updateMany({
      where: { id, employee: { entrepriseId } },
      data,
    }).then(() => this.findById(id, entrepriseId));
  }

  async getPayments(id: string, entrepriseId: string) {
    const payslip = await this.findById(id, entrepriseId);
    if (!payslip) return null;
    return await prisma.payment.findMany({
      where: { payslipId: id },
      include: { caissier: true },
    });
  }

  async findByUserId(userId: string): Promise<Payslip[]> {
    return await prisma.payslip.findMany({
      where: { employee: { userId } },
      include: { employee: true, cycle: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new PayslipRepository();
