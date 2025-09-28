import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class EntrepriseRepository {
    async findAll() {
        return await prisma.entreprise.findMany();
    }
    async findById(id) {
        return await prisma.entreprise.findUnique({ where: { id } });
    }
    async create(data) {
        return await prisma.entreprise.create({ data });
    }
    async update(id, data) {
        return await prisma.entreprise.update({ where: { id }, data });
    }
    async delete(id) {
        await prisma.entreprise.delete({ where: { id } });
    }
}
export default new EntrepriseRepository();
//# sourceMappingURL=entrepriseRepository.js.map