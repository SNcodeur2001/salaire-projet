import { PrismaClient } from '@prisma/client';
import payslipRepository from '../repositories/payslipRepository.js';
const prisma = new PrismaClient();
export class PayslipService {
    async getPayslipById(id, entrepriseId) {
        const payslip = await payslipRepository.findById(id, entrepriseId);
        if (!payslip) {
            throw new Error('Bulletin de paie non trouvé');
        }
        return payslip;
    }
    async updatePayslip(id, entrepriseId, data) {
        const payslip = await this.getPayslipById(id, entrepriseId);
        // Business logic: can only update if cycle is BROUILLON
        const cycle = await prisma.payrollCycle.findUnique({ where: { id: payslip.cycleId } });
        if (cycle && cycle.status !== 'BROUILLON') {
            throw new Error('Impossible de modifier un bulletin dont le cycle n\'est pas en BROUILLON');
        }
        return await payslipRepository.update(id, entrepriseId, data);
    }
    async getPayslipPayments(id, entrepriseId) {
        const payments = await payslipRepository.getPayments(id, entrepriseId);
        if (!payments) {
            throw new Error('Bulletin de paie non trouvé');
        }
        return payments;
    }
}
export default new PayslipService();
//# sourceMappingURL=payslipService.js.map