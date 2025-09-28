import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class UserRepository {
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }
    async create(data) {
        return await prisma.user.create({ data });
    }
    async findById(id) {
        return await prisma.user.findUnique({ where: { id } });
    }
}
export default new UserRepository();
//# sourceMappingURL=userRepository.js.map