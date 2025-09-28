import { PayrunStatus } from '@prisma/client';
import payrunRepository from '../repositories/payrunRepository.js';
export class PayrunService {
    async getAllPayruns(entrepriseId) {
        return await payrunRepository.findAll(entrepriseId);
    }
    async getPayrunById(id, entrepriseId) {
        const payrun = await payrunRepository.findById(id, entrepriseId);
        if (!payrun) {
            throw new Error('Cycle de paie non trouvé');
        }
        return payrun;
    }
    async createPayrun(data) {
        // Validation
        if (!data.period) {
            throw new Error('Période requise');
        }
        return await payrunRepository.create(data);
    }
    async updatePayrunStatus(id, entrepriseId, status) {
        const payrun = await this.getPayrunById(id, entrepriseId);
        // Business logic: can only update if not CLOS
        if (payrun.status === PayrunStatus.CLOS) {
            throw new Error('Cycle déjà clos');
        }
        return await payrunRepository.updateStatus(id, entrepriseId, status);
    }
    async getPayrunPayslips(id, entrepriseId) {
        const payslips = await payrunRepository.getPayslips(id, entrepriseId);
        if (!payslips) {
            throw new Error('Cycle de paie non trouvé');
        }
        return payslips;
    }
}
export default new PayrunService();
//# sourceMappingURL=payrunService.js.map