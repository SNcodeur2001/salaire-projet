import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class PayrunRepository {
    async findAll(entrepriseId) {
        return await prisma.payrollCycle.findMany({
            where: { entrepriseId },
            include: { payslips: true, entreprise: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id, entrepriseId) {
        return await prisma.payrollCycle.findFirst({
            where: { id, entrepriseId },
            include: { payslips: true, entreprise: true },
        });
    }
    async create(data) {
        return await prisma.payrollCycle.create({ data });
    }
    async updateStatus(id, entrepriseId, status) {
        return await prisma.payrollCycle.updateMany({
            where: { id, entrepriseId },
            data: { status },
        }).then(() => this.findById(id, entrepriseId));
    }
    async getPayslips(id, entrepriseId) {
        const payrun = await this.findById(id, entrepriseId);
        if (!payrun)
            return null;
        return await prisma.payslip.findMany({
            where: { cycleId: id },
            include: { employee: true, payments: true },
        });
    }
}
export default new PayrunRepository();
//# sourceMappingURL=payrunRepository.js.map