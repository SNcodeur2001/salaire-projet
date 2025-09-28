import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class EmployeeRepository {
    async findAll(entrepriseId) {
        return await prisma.employee.findMany({
            where: { entrepriseId },
            include: { user: true, entreprise: true, payslips: true },
        });
    }
    async findById(id, entrepriseId) {
        return await prisma.employee.findFirst({
            where: { id, entrepriseId },
            include: { user: true, entreprise: true, payslips: true },
        });
    }
    async create(data) {
        return await prisma.employee.create({ data });
    }
    async update(id, entrepriseId, data) {
        return await prisma.employee.updateMany({
            where: { id, entrepriseId },
            data,
        }).then(() => this.findById(id, entrepriseId));
    }
    async activate(id, entrepriseId, isActive) {
        return await prisma.employee.updateMany({
            where: { id, entrepriseId },
            data: { isActive },
        }).then(() => this.findById(id, entrepriseId));
    }
    async filter(entrepriseId, filters) {
        return await prisma.employee.findMany({
            where: {
                entrepriseId,
                ...filters,
            },
            include: { user: true, entreprise: true },
        });
    }
}
export default new EmployeeRepository();
//# sourceMappingURL=employeeRepository.js.map