import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class PayslipRepository {
    async findById(id, entrepriseId) {
        return await prisma.payslip.findFirst({
            where: { id, employee: { entrepriseId } },
            include: { employee: true, cycle: true, payments: true },
        });
    }
    async update(id, entrepriseId, data) {
        return await prisma.payslip.updateMany({
            where: { id, employee: { entrepriseId } },
            data,
        }).then(() => this.findById(id, entrepriseId));
    }
    async getPayments(id, entrepriseId) {
        const payslip = await this.findById(id, entrepriseId);
        if (!payslip)
            return null;
        return await prisma.payment.findMany({
            where: { payslipId: id },
            include: { caissier: true },
        });
    }
}
export default new PayslipRepository();
//# sourceMappingURL=payslipRepository.js.map