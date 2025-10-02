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
      let grossSalary = employee.baseSalary;
      let daysWorked: number | undefined;
      let hoursWorked: number | undefined;

      if (employee.contract === 'JOURNALIER') {
        // Calculate number of days in the month
        const [year, month] = data.period.split('-').map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();
        daysWorked = daysInMonth;
        grossSalary = employee.baseSalary * daysInMonth;
      } else if (employee.contract === 'HONORAIRE') {
        // Default to 0 hours, can be updated later
        hoursWorked = 0;
        grossSalary = 0;
      } else if (employee.contract === 'FIXE') {
        // Use baseSalary as is
        grossSalary = employee.baseSalary;
      }

      await payslipRepository.create({
        employeeId: employee.id,
        cycleId: payrun.id,
        grossSalary,
        deductions: 0, // Default to 0, can be updated later
        netSalary: grossSalary,
        daysWorked,
        hoursWorked,
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

  async generatePayslips(payrunId: string, entrepriseId: string) {
    const payrun = await this.getPayrunById(payrunId, entrepriseId);

    // Check if payrun is APPROUVE
    if (payrun.status !== PayrunStatus.APPROUVE) {
      throw new Error('Le cycle doit être approuvé pour générer les bulletins');
    }

    // Get all payslips for this payrun
    const payslips = await payrunRepository.getPayslips(payrunId, entrepriseId);

    // Update payrun status to CLOS
    await payrunRepository.updateStatus(payrunId, entrepriseId, PayrunStatus.CLOS);

    return payslips;
  }
}

export default new PayrunService();
