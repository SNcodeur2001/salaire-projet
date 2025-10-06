import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class UserRepository {
    async findAll() {
        return await prisma.user.findMany({
            include: { entreprise: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }
    async create(data) {
        return await prisma.user.create({ data });
    }
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id },
            include: { entreprise: true },
        });
    }
    async update(id, data) {
        return await prisma.user.update({
            where: { id },
            data,
            include: { entreprise: true },
        });
    }
    async delete(id) {
        await prisma.user.delete({ where: { id } });
    }
}
export default new UserRepository();
//# sourceMappingURL=userRepository.js.map