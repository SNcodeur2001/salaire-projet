import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class PaymentRepository {
    async create(data) {
        return await prisma.payment.create({ data });
    }
    async findById(id) {
        return await prisma.payment.findUnique({
            where: { id },
            include: { payslip: true, caissier: true },
        });
    }
    async updatePayslipStatus(payslipId, status) {
        await prisma.payslip.update({
            where: { id: payslipId },
            data: { status },
        });
    }
    async getTotalPaid(payslipId) {
        const result = await prisma.payment.aggregate({
            where: { payslipId },
            _sum: { amount: true },
        });
        return result._sum.amount || 0;
    }
    async findAll(filters = {}) {
        const where = {};
        if (filters.entrepriseId) {
            where.payslip = {
                employee: {
                    entrepriseId: filters.entrepriseId,
                },
            };
        }
        return await prisma.payment.findMany({
            where,
            include: {
                payslip: {
                    include: {
                        employee: true,
                    },
                },
                caissier: true,
            },
            orderBy: { paymentDate: 'desc' },
        });
    }
}
export default new PaymentRepository();
//# sourceMappingURL=paymentRepository.js.map