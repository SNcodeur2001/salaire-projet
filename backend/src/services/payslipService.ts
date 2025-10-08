import { PrismaClient } from '@prisma/client';
import payslipRepository from '../repositories/payslipRepository.js';
import { generatePayslipPdf } from '../utils/pdfGenerator.js';

const prisma = new PrismaClient();

export class PayslipService {
  async getAllPayslips(entrepriseId: string) {
    return await payslipRepository.findAllByEntreprise(entrepriseId);
  }

  async getPayslipById(id: string, entrepriseId: string) {
    const payslip = await payslipRepository.findById(id, entrepriseId);
    if (!payslip) {
      throw new Error('Bulletin de paie non trouvé');
    }
    return payslip;
  }

  async updatePayslip(id: string, entrepriseId: string, data: {
    grossSalary?: number;
    deductions?: number;
    netSalary?: number;
    hoursWorked?: number;
  }) {
    const payslip = await this.getPayslipById(id, entrepriseId);
    // Business logic: can only update if cycle is BROUILLON
    const cycle = await prisma.payrollCycle.findUnique({ where: { id: payslip.cycleId } });
    if (cycle && cycle.status !== 'BROUILLON') {
      throw new Error('Impossible de modifier un bulletin dont le cycle n\'est pas en BROUILLON');
    }
    return await payslipRepository.update(id, entrepriseId, data);
  }

  async getPayslipPayments(id: string, entrepriseId: string) {
    const payments = await payslipRepository.getPayments(id, entrepriseId);
    if (!payments) {
      throw new Error('Bulletin de paie non trouvé');
    }
    return payments;
  }

  async generatePayslipPdf(id: string, entrepriseId: string, res: any) {
    const payslip = await prisma.payslip.findFirst({
      where: { id, employee: { entrepriseId } },
      include: { employee: true, cycle: true },
    });
    if (!payslip) {
      throw new Error('Bulletin de paie non trouvé');
    }

    const entreprise = await prisma.entreprise.findUnique({
      where: { id: entrepriseId },
    });

    if (!entreprise) {
      throw new Error('Entreprise non trouvée');
    }

    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="bulletin-${id}.pdf"`);

    doc.pipe(res);

    generatePayslipPdf(doc, { payslip, entreprise });
  }

  async getPayslipsByUserId(userId: string) {
    return await payslipRepository.findByUserId(userId);
  }
}

export default new PayslipService();
