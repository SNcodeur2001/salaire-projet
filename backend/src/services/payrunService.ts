import { PayrunStatus } from '@prisma/client';
import payrunRepository from '../repositories/payrunRepository.js';
import payslipRepository from '../repositories/payslipRepository.js';
import employeeRepository from '../repositories/employeeRepository.js';

export class PayrunService {
  async getAllPayruns(entrepriseId: string) {
    return await payrunRepository.findAll(entrepriseId);
  }

  async getPayrunById(id: string, entrepriseId: string) {
    const payrun = await payrunRepository.findById(id, entrepriseId);
    if (!payrun) {
      throw new Error('Cycle de paie non trouvé');
    }
    return payrun;
  }

  async createPayrun(data: {
    period: string;
    entrepriseId: string;
  }) {
    // Validation
    if (!data.period) {
      throw new Error('Période requise');
    }

    // Create payrun
    const payrun = await payrunRepository.create(data);

    // Auto-create payslips for active employees
    const activeEmployees = await employeeRepository.findAllActive(data.entrepriseId);
    for (const employee of activeEmployees) {
      await payslipRepository.create({
        employeeId: employee.id,
        cycleId: payrun.id,
        grossSalary: employee.baseSalary,
        deductions: 0, // Default to 0, can be updated later
        netSalary: employee.baseSalary,
      });
    }

    return payrun;
  }

  async updatePayrunStatus(id: string, entrepriseId: string, status: PayrunStatus) {
    const payrun = await this.getPayrunById(id, entrepriseId);
    // Business logic: can only update if not CLOS
    if (payrun.status === PayrunStatus.CLOS) {
      throw new Error('Cycle déjà clos');
    }
    return await payrunRepository.updateStatus(id, entrepriseId, status);
  }

  async getPayrunPayslips(id: string, entrepriseId: string) {
    const payslips = await payrunRepository.getPayslips(id, entrepriseId);
    if (!payslips) {
      throw new Error('Cycle de paie non trouvé');
    }
    return payslips;
  }
}

export default new PayrunService();
